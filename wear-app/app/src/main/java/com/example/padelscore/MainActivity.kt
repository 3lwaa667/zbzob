package com.example.padelscore

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Scaffold
import androidx.wear.compose.material.TimeText
import com.example.padelscore.presentation.ScoreScreen
import com.example.padelscore.presentation.theme.PadelScoreTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PadelScoreApp()
        }
    }
}

@Composable
fun PadelScoreApp() {
    PadelScoreTheme {
        Scaffold(
            timeText = { TimeText() },
            modifier = Modifier.fillMaxSize()
        ) {
            ScoreScreen()
        }
    }
}
