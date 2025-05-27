package com.multimodaltrading.android.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.multimodaltrading.android.models.ModalityType

class ModalityViewModel : ViewModel() {
    // State flows
    private val _currentModality = MutableStateFlow(ModalityType.VISUAL)
    val currentModality: StateFlow<ModalityType> = _currentModality.asStateFlow()
    
    private val _isContextAware = MutableStateFlow(true)
    val isContextAware: StateFlow<Boolean> = _isContextAware.asStateFlow()
    
    // Context awareness service would be injected in a real app
    private val contextAwarenessService = com.multimodaltrading.android.services.ContextAwarenessService()
    
    init {
        // Initialize with default modality
        detectPreferredModality()
    }
    
    // Switch modality manually
    fun switchModality(modality: ModalityType) {
        _currentModality.value = modality
        _isContextAware.value = false
    }
    
    // Enable context awareness
    fun enableContextAwareness() {
        _isContextAware.value = true
        detectPreferredModality()
    }
    
    // Detect preferred modality based on current context
    fun detectPreferredModality() {
        if (_isContextAware.value) {
            val context = contextAwarenessService.detectContext()
            _currentModality.value = context.preferredModality
        }
    }
}
