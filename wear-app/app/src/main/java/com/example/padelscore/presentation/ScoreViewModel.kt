package com.example.padelscore.presentation

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class ScoreState(
    val team1Sets: Int = 0,
    val team1Games: Int = 0,
    val team1Points: String = "0",
    val team2Sets: Int = 0,
    val team2Games: Int = 0,
    val team2Points: String = "0",
    val team1Players: List<String> = emptyList(),
    val team2Players: List<String> = emptyList(),
    val availablePlayers: List<String> = listOf("hazem", "aly", "ezz", "el mo", "joe", "seif"),
    val servingTeam: Int = 1,
    val elapsedSeconds: Long = 0L,
    val isTimerRunning: Boolean = false,
    val hasMatchStarted: Boolean = false,
    val status: String = "Match in Progress",
    val lastScoreTimestamp: Long = 0L
)

class ScoreViewModel : ViewModel() {
    private val _state = MutableStateFlow(ScoreState())
    val state: StateFlow<ScoreState> = _state.asStateFlow()

    private val history = mutableListOf<ScoreState>()
    private var timerJob: kotlinx.coroutines.Job? = null

    private fun startTimerIfNeeded() {
        if (!_state.value.hasMatchStarted) {
            _state.update { it.copy(hasMatchStarted = true, isTimerRunning = true) }
            startTimerJob()
        } else if (!_state.value.isTimerRunning) {
            _state.update { it.copy(isTimerRunning = true) }
            startTimerJob()
        }
    }

    private fun startTimerJob() {
        timerJob?.cancel()
        timerJob = androidx.lifecycle.viewModelScope.launch {
            while (true) {
                kotlinx.coroutines.delay(1000L)
                if (_state.value.isTimerRunning) {
                    _state.update { it.copy(elapsedSeconds = it.elapsedSeconds + 1) }
                }
            }
        }
    }

    fun pauseTimer() {
        _state.update { it.copy(isTimerRunning = false) }
        timerJob?.cancel()
    }

    fun resumeTimer() {
        if (_state.value.hasMatchStarted && !_state.value.isTimerRunning) {
            _state.update { it.copy(isTimerRunning = true) }
            startTimerJob()
        }
    }

    fun randomizePlayers() {
        val pool = _state.value.availablePlayers.shuffled()
        _state.update {
            it.copy(
                team1Players = pool.take(2),
                team2Players = pool.drop(2).take(2)
            )
        }
    }

    fun togglePlayerTeam(player: String) {
        _state.update { s ->
            val inT1 = s.team1Players.contains(player)
            val inT2 = s.team2Players.contains(player)
            when {
                inT1 -> s.copy(team1Players = s.team1Players - player, team2Players = s.team2Players + player)
                inT2 -> s.copy(team2Players = s.team2Players - player)
                else -> {
                    if (s.team1Players.size < 2) s.copy(team1Players = s.team1Players + player)
                    else if (s.team2Players.size < 2) s.copy(team2Players = s.team2Players + player)
                    else s
                }
            }
        }
    }

    fun addAvailablePlayer(player: String) {
        if (player.isNotBlank() && !_state.value.availablePlayers.contains(player)) {
            _state.update { it.copy(availablePlayers = it.availablePlayers + player) }
        }
    }

    fun removeAvailablePlayer(player: String) {
        _state.update { 
            it.copy(
                availablePlayers = it.availablePlayers - player,
                team1Players = it.team1Players - player,
                team2Players = it.team2Players - player
            )
        }
    }

    private fun pushHistory() {
        history.add(_state.value)
    }

    private fun popHistory() {
        if (history.isNotEmpty()) {
            _state.value = history.removeLast().copy(lastScoreTimestamp = System.currentTimeMillis())
        }
    }

    fun incrementTeam1() {
        if (isDebouncing()) return
        pushHistory()
        startTimerIfNeeded()
        
        val s = _state.value
        var nextT1 = s.team1Points
        var nextT2 = s.team2Points
        var gameWon = false

        when (s.team1Points) {
            "0" -> nextT1 = "15"
            "15" -> nextT1 = "30"
            "30" -> nextT1 = "40"
            "40" -> {
                when (s.team2Points) {
                    "40" -> nextT1 = "AD"
                    "AD" -> { nextT1 = "GP"; nextT2 = "GP" }
                    else -> gameWon = true
                }
            }
            "AD", "GP" -> gameWon = true
        }

        if (gameWon) {
            handleTeamGameWin(1)
        } else {
            _state.update { it.copy(team1Points = nextT1, team2Points = nextT2, lastScoreTimestamp = System.currentTimeMillis()) }
        }
    }

    fun decrementTeam1() {
        if (isDebouncing()) return
        popHistory()
    }

    fun incrementTeam2() {
        if (isDebouncing()) return
        pushHistory()
        startTimerIfNeeded()
        
        val s = _state.value
        var nextT1 = s.team1Points
        var nextT2 = s.team2Points
        var gameWon = false

        when (s.team2Points) {
            "0" -> nextT2 = "15"
            "15" -> nextT2 = "30"
            "30" -> nextT2 = "40"
            "40" -> {
                when (s.team1Points) {
                    "40" -> nextT2 = "AD"
                    "AD" -> { nextT1 = "GP"; nextT2 = "GP" }
                    else -> gameWon = true
                }
            }
            "AD", "GP" -> gameWon = true
        }

        if (gameWon) {
            handleTeamGameWin(2)
        } else {
            _state.update { it.copy(team1Points = nextT1, team2Points = nextT2, lastScoreTimestamp = System.currentTimeMillis()) }
        }
    }

    fun decrementTeam2() {
        if (isDebouncing()) return
        popHistory()
    }

    fun resetMatch() {
        val currentPlayers1 = _state.value.team1Players
        val currentPlayers2 = _state.value.team2Players
        history.clear()
        timerJob?.cancel()
        _state.value = ScoreState(
            team1Players = currentPlayers1,
            team2Players = currentPlayers2,
            lastScoreTimestamp = System.currentTimeMillis()
        )
    }

    private fun handleTeamGameWin(team: Int) {
        _state.update { 
            val nextT1Games = if (team == 1) it.team1Games + 1 else it.team1Games
            val nextT2Games = if (team == 2) it.team2Games + 1 else it.team2Games
            it.copy(
                team1Points = "0",
                team2Points = "0",
                team1Games = nextT1Games,
                team2Games = nextT2Games,
                servingTeam = if (it.servingTeam == 1) 2 else 1,
                lastScoreTimestamp = System.currentTimeMillis()
            )
        }
    }

    private fun isDebouncing(): Boolean {
        return System.currentTimeMillis() - _state.value.lastScoreTimestamp < 300
    }
}
