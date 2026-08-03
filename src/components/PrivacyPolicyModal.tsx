'use client'

import { useEffect } from 'react'
import { PrivacyContent } from '@/components/legal/PrivacyContent'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Modal legacy: mismo contenido que /privacidad. Preferir la ruta dedicada. */
export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D1117] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#0D1117] border-b border-white/10 px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Política de Privacidad
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 md:px-8 py-6 md:py-8">
          <PrivacyContent />
        </div>
      </div>
    </div>
  )
}
