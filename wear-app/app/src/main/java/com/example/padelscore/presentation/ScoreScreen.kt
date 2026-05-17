package com.example.padelscore.presentation

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Refresh

@Composable
fun ScoreScreen(
    viewModel: ScoreViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

    fun vibrate() {
        vibrator.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Team 1 Section
        ScoreRow(
            teamName = "TEAM 1",
            points = state.team1Points,
            games = state.team1Games,
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

        // Divider
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(Color.Gray.copy(alpha = 0.5f))
        )

        // Team 2 Section
        ScoreRow(
            teamName = "TEAM 2",
            points = state.team2Points,
            games = state.team2Games,
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
            modifier = Modifier.size(24.dp).padding(4.dp),
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
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Left Column: Name & Games
        Column(horizontalAlignment = Alignment.Start) {
            Text(
                text = teamName,
                style = MaterialTheme.typography.caption2,
                color = MaterialTheme.colors.primary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "G: $games",
                style = MaterialTheme.typography.body2,
                color = Color.White.copy(alpha = 0.7f)
            )
        }

        // Center: Points
        Text(
            text = points,
            fontSize = 44.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )

        // Right: Buttons
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.End
        ) {
            Button(
                onClick = onIncrement,
                modifier = Modifier.size(36.dp),
                colors = ButtonDefaults.primaryButtonColors()
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add")
            }
            Spacer(modifier = Modifier.height(4.dp))
            Button(
                onClick = onDecrement,
                modifier = Modifier.size(36.dp),
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.DarkGray)
            ) {
                Icon(Icons.Default.Remove, contentDescription = "Remove")
            }
        }
    }
}
