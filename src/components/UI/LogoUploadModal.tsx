import { useState } from "react";
import { useTranslation } from "react-i18next";
import BottomSheetModal from "./BottomSheetModal";

interface LogoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLogoUrl: string | null;
    onLogoUpdate: (logoUrl: string) => void;
    title?: string;
    subtitle?: string;
    maxSizeMB?: number;
}

export const LogoUploadModal = ({
    isOpen,
    onClose,
    currentLogoUrl,
    onLogoUpdate,
    title,
    subtitle,
    maxSizeMB = 2
}: LogoUploadModalProps) => {
    const { t } = useTranslation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle file selection
    const handleFileSelect = (file: File) => {
        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert(t('file-too-large', `File is too large. Maximum size is ${maxSizeMB}MB`));
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert(t('invalid-file-type', 'Please select a valid image file (PNG or JPG)'));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle drag & drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    // Handle logo update
    const handleUpdateLogo = () => {
        if (logoPreview) {
            onLogoUpdate(logoPreview);
            handleClose();
        }
    };

    // Handle logo removal
    const handleRemoveLogo = () => {
        setLogoPreview(null);
    };

    // Handle modal close
    const handleClose = () => {
        setLogoPreview(null);
        setIsDragging(false);
        onClose();
    };

    // Set initial preview when modal opens
    const effectivePreview = logoPreview || currentLogoUrl;

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title || t("update-company-logo", "Update Company Logo")}
            subtitle={subtitle || t("upload-new-logo", "Upload a new logo for your company")}
            icon="image"
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
            maxWidth="2xl"
            footer={
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">close</span>
                            {t("cancel", "Cancel")}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdateLogo}
                        disabled={!logoPreview}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">check</span>
                            {t("update-logo", "Update Logo")}
                        </span>
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl transition-all ${
                        isDragging 
                            ? 'border-primary bg-primary/5 scale-[1.02]' 
                            : 'border-gray-300 bg-gray-50'
                    }`}
                >
                    <div className="p-8 sm:p-12">
                        {/* Preview Area */}
                        {effectivePreview ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl bg-white border-2 border-gray-200 overflow-hidden shadow-sm">
                                        <img 
                                            src={effectivePreview} 
                                            alt="Logo Preview" 
                                            className="w-full h-full object-contain p-4"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <label className="cursor-pointer">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileSelect(file);
                                            }}
                                        />
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                                            <span className="material-symbols-outlined text-lg">sync</span>
                                            {t("change-image", "Change Image")}
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        {t("remove", "Remove")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-4xl">
                                            cloud_upload
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {t("drop-image-here", "Drop your image here")}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {t("or-click-to-browse", "or click to browse from your device")}
                                </p>
                                <label className="cursor-pointer inline-block">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(file);
                                        }}
                                    />
                                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm">
                                        <span className="material-symbols-outlined text-lg">upload_file</span>
                                        {t("select-file", "Select File")}
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Requirements Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 flex-shrink-0">info</span>
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-blue-900 mb-2">
                                {t("image-requirements", "Image Requirements")}
                            </p>
                            <ul className="space-y-1 text-blue-700">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                    {t("format-png-jpg", "Format: PNG or JPG")}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                    {t("max-size", `Maximum size: ${maxSizeMB}MB`)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                    {t("recommended-square", "Recommended: Square format (500x500px)")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </BottomSheetModal>
    );
};

export default LogoUploadModal;
