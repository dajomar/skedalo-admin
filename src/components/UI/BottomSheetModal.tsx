import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface BottomSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: string;
    iconBgColor?: string;
    iconColor?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    showDragIndicator?: boolean;
    enableSwipeDown?: boolean;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    iconBgColor = 'bg-primary/10',
    iconColor = 'text-primary',
    children,
    footer,
    maxWidth = '3xl',
    showDragIndicator = true,
    enableSwipeDown = true
}) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Block body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            // Cleanup on unmount
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl'
    };

    // Handle bottom sheet swipe down to close on mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!enableSwipeDown) return;
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!enableSwipeDown) return;
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!enableSwipeDown) return;
        if (touchStart - touchEnd < -100) {
            // Swiped down more than 100px
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container - Bottom Sheet on mobile, centered modal on desktop */}
            <div
                className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white shadow-2xl flex flex-col animate-slide-up sm:animate-none overflow-hidden
                    max-h-[92dvh] rounded-t-3xl sm:max-h-[90vh] sm:rounded-xl
                    pb-[env(safe-area-inset-bottom)] sm:pb-0
                `}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag indicator for mobile */}
                {showDragIndicator && (
                    <div className="flex justify-center pt-3 pb-2 sm:hidden flex-shrink-0">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>
                )}

                {/* Header - Fixed */}
                <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        {icon && (
                            <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
                                <span className={`material-symbols-outlined ${iconColor} text-xl`}>{icon}</span>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>

                {/* Footer - Fixed */}
                {footer && (
                    <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomSheetModal;
