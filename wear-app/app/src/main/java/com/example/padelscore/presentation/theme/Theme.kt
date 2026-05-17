package com.example.padelscore.presentation.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.Colors
import androidx.wear.compose.material.MaterialTheme

val PadelYellow = Color(0xFFC6FF00) // Classic ball color
val DarkBlue = Color(0xFF0D1B2A)
val SurfaceColor = Color(0xFF1B263B)

private val WearColorPalette = Colors(
    primary = PadelYellow,
    secondary = Color.White,
    background = Color.Black,
    surface = SurfaceColor,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White,
)

@Composable
fun PadelScoreTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colors = WearColorPalette,
        content = content
    )
}
