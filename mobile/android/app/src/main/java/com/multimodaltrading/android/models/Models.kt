package com.multimodaltrading.android.models

data class User(
    val id: String,
    val email: String?,
    val name: String
)

data class Transaction(
    val id: String,
    val type: String,
    val token: String,
    val amount: String,
    val toToken: String? = null,
    val toAmount: String? = null,
    val timestamp: String
)

data class Trade(
    val id: String,
    val type: String,
    val price: String,
    val amount: String,
    val timeAgo: String
)

data class TradingResult(
    val success: Boolean,
    val error: String?
)

enum class ModalityType {
    VISUAL,
    VOICE,
    TEXT
}

data class Context(
    val preferredModality: ModalityType,
    val environment: String,
    val deviceType: String,
    val isMoving: Boolean,
    val noiseLevel: NoiseLevel,
    val lightLevel: LightLevel
)

enum class NoiseLevel {
    LOW,
    MEDIUM,
    HIGH
}

enum class LightLevel {
    DARK,
    DIM,
    BRIGHT
}
