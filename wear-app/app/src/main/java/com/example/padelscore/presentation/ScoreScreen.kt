package com.example.padelscore.presentation

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.foundation.background
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.wear.compose.material.dialog.Dialog
import androidx.wear.compose.foundation.lazy.ScalingLazyColumn
import androidx.wear.compose.foundation.lazy.items

@Composable
fun ScoreScreen(
    viewModel: ScoreViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE || event == Lifecycle.Event.ON_STOP) {
                viewModel.pauseTimer()
            } else if (event == Lifecycle.Event.ON_RESUME || event == Lifecycle.Event.ON_START) {
                viewModel.resumeTimer()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    fun vibrate() {
        vibrator.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
    }

    var showPlayerSetup by remember { mutableStateOf(false) }

    Dialog(
        showDialog = showPlayerSetup,
        onDismissRequest = { showPlayerSetup = false }
    ) {
        Column(
            modifier = Modifier.fillMaxSize().background(Color.Black).padding(top = 16.dp, bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "SELECT PLAYERS", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colors.primary)
            Spacer(modifier = Modifier.height(4.dp))
            ScalingLazyColumn(
                modifier = Modifier.fillMaxWidth().weight(1f),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                items(state.availablePlayers) { player ->
                    val inTeam1 = state.team1Players.contains(player)
                    val inTeam2 = state.team2Players.contains(player)
                    val bgColor = when {
                        inTeam1 -> Color(0xFF1B5E20)
                        inTeam2 -> Color(0xFF01579B)
                        else -> Color.DarkGray
                    }
                    val tName = when {
                        inTeam1 -> "T1"
                        inTeam2 -> "T2"
                        else -> ""
                    }
                    Chip(
                        onClick = { viewModel.togglePlayerTeam(player) },
                        label = { Text(player, color = Color.White) },
                        secondaryLabel = { if (tName.isNotEmpty()) Text(tName, color = Color.LightGray) },
                        colors = ChipDefaults.chipColors(backgroundColor = bgColor),
                        modifier = Modifier.fillMaxWidth(0.8f).padding(vertical = 2.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Button(
                    onClick = { viewModel.randomizePlayers() },
                    modifier = Modifier.size(36.dp),
                    colors = ButtonDefaults.buttonColors(backgroundColor = Color.DarkGray)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = "Randomize", modifier = Modifier.size(18.dp))
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = { showPlayerSetup = false },
                    modifier = Modifier.size(36.dp),
                    colors = ButtonDefaults.primaryButtonColors()
                ) {
                    Text("DONE", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
            .padding(horizontal = 12.dp, vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Team 1 Section
        ScoreRow(
            teamName = "TEAM 1",
            points = state.team1Points,
            games = state.team1Games,
            isServing = state.servingTeam == 1,
            players = state.team1Players,
            onTeamClick = { if (!state.hasMatchStarted) showPlayerSetup = true else viewModel.randomizePlayers() },
            onIncrement = { 
                viewModel.incrementTeam1()
                vibrate()
            },
            onDecrement = { 
                viewModel.decrementTeam1()
                vibrate()
            },
            modifier = Modifier.weight(1f)
        )

        // Timer Divider
        fun formatTime(seconds: Long): String {
            val mins = seconds / 60
            val secs = seconds % 60
            return String.format("%02d:%02d", mins, secs)
        }

        Row(
            modifier = Modifier.fillMaxWidth(0.9f).padding(vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Box(modifier = Modifier.height(1.dp).weight(1f).background(Color.Gray.copy(alpha=0.3f)))
            if (state.hasMatchStarted) {
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .background(Color.DarkGray.copy(alpha=0.8f), androidx.compose.foundation.shape.RoundedCornerShape(50))
                        .padding(horizontal = 8.dp, vertical = 2.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = formatTime(state.elapsedSeconds), 
                        color = MaterialTheme.colors.primary, 
                        fontSize = 11.sp, 
                        fontWeight = FontWeight.Bold
                    )
                }
            } else {
                Box(modifier = Modifier.height(1.dp).width(30.dp).background(Color.Gray.copy(alpha=0.3f)))
            }
            Box(modifier = Modifier.height(1.dp).weight(1f).background(Color.Gray.copy(alpha=0.3f)))
        }

        // Team 2 Section
        ScoreRow(
            teamName = "TEAM 2",
            points = state.team2Points,
            games = state.team2Games,
            isServing = state.servingTeam == 2,
            players = state.team2Players,
            onTeamClick = { if (!state.hasMatchStarted) showPlayerSetup = true else viewModel.randomizePlayers() },
            onIncrement = { 
                viewModel.incrementTeam2()
                vibrate()
            },
            onDecrement = { 
                viewModel.decrementTeam2()
                vibrate()
            },
            modifier = Modifier.weight(1f)
        )
        
        // Minor Reset Button at bottom right if needed, or long press
        Button(
            onClick = { viewModel.resetMatch() },
            modifier = Modifier.size(24.dp).padding(2.dp),
            colors = ButtonDefaults.buttonColors(backgroundColor = Color.DarkGray)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = "Reset", modifier = Modifier.size(12.dp))
        }
    }
}

@Composable
fun ScoreRow(
    teamName: String,
    points: String,
    games: Int,
    isServing: Boolean,
    players: List<String>,
    onTeamClick: () -> Unit,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        // Left Column: Name & Games (with clickable event)
        Column(
            horizontalAlignment = Alignment.Start,
            modifier = Modifier.weight(1f)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = androidx.compose.foundation.clickable { onTeamClick() }
            ) {
                Text(
                    text = teamName,
                    style = MaterialTheme.typography.caption2,
                    color = MaterialTheme.colors.primary,
                    fontWeight = FontWeight.Bold
                )
                if (isServing) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Box(modifier = Modifier.size(6.dp).background(MaterialTheme.colors.primary, CircleShape))
                }
            }
            if (players.isNotEmpty()) {
                Text(
                    text = players.joinToString(",\n"),
                    style = MaterialTheme.typography.title3.copy(fontSize = 9.sp),
                    color = Color.LightGray,
                    lineHeight = 10.sp
                )
            }
            Text(
                text = "G: $games",
                style = MaterialTheme.typography.body2,
                color = Color.White.copy(alpha = 0.7f)
            )
        }

        // Center: Points
        Text(
            text = points,
            fontSize = 42.sp,
            fontWeight = FontWeight.Black,
            color = Color.White,
            modifier = Modifier.weight(1f),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )

        // Right: Buttons
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.End,
            modifier = Modifier.weight(1f)
        ) {
            Button(
                onClick = onIncrement,
                modifier = Modifier.size(32.dp),
                colors = ButtonDefaults.primaryButtonColors()
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add", modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Button(
                onClick = onDecrement,
                modifier = Modifier.size(32.dp),
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.DarkGray)
            ) {
                Icon(Icons.Default.Remove, contentDescription = "Remove", modifier = Modifier.size(18.dp))
            }
        }
    }
}
