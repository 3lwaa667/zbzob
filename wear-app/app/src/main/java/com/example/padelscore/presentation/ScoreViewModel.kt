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
    val status: String = "Match in Progress",
    val lastScoreTimestamp: Long = 0L
)

class ScoreViewModel : ViewModel() {
    private val _state = MutableStateFlow(ScoreState())
    val state: StateFlow<ScoreState> = _state.asStateFlow()

    private val progression = listOf("0", "15", "30", "40", "GAME")

    fun incrementTeam1() {
        if (isDebouncing()) return
        
        val currentIndex = progression.indexOf(_state.value.team1Points)
        if (currentIndex < progression.size - 1) {
            val nextPoint = progression[currentIndex + 1]
            if (nextPoint == "GAME") {
                handleTeam1GameWin()
            } else {
                _state.update { it.copy(team1Points = nextPoint, lastScoreTimestamp = System.currentTimeMillis()) }
            }
        }
    }

    fun decrementTeam1() {
        if (isDebouncing()) return
        val currentIndex = progression.indexOf(_state.value.team1Points)
        if (currentIndex > 0) {
            _state.update { it.copy(team1Points = progression[currentIndex - 1], lastScoreTimestamp = System.currentTimeMillis()) }
        }
    }

    fun incrementTeam2() {
        if (isDebouncing()) return
        val currentIndex = progression.indexOf(_state.value.team2Points)
        if (currentIndex < progression.size - 1) {
            val nextPoint = progression[currentIndex + 1]
            if (nextPoint == "GAME") {
                handleTeam2GameWin()
            } else {
                _state.update { it.copy(team2Points = nextPoint, lastScoreTimestamp = System.currentTimeMillis()) }
            }
        }
    }

    fun decrementTeam2() {
        if (isDebouncing()) return
        val currentIndex = progression.indexOf(_state.value.team2Points)
        if (currentIndex > 0) {
            _state.update { it.copy(team2Points = progression[currentIndex - 1], lastScoreTimestamp = System.currentTimeMillis()) }
        }
    }

    fun resetMatch() {
        _state.value = ScoreState()
    }

    private fun handleTeam1GameWin() {
        _state.update { 
            val nextGames = it.team1Games + 1
            it.copy(
                team1Points = "0",
                team2Points = "0",
                team1Games = nextGames,
                lastScoreTimestamp = System.currentTimeMillis()
            )
        }
    }

    private fun handleTeam2GameWin() {
        _state.update { 
            val nextGames = it.team2Games + 1
            it.copy(
                team1Points = "0",
                team2Points = "0",
                team2Games = nextGames,
                lastScoreTimestamp = System.currentTimeMillis()
            )
        }
    }

    private fun isDebouncing(): Boolean {
        // Prevent accidental double taps within 300ms
        return System.currentTimeMillis() - _state.value.lastScoreTimestamp < 300
    }
}
