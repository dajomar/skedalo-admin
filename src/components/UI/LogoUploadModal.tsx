import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import BottomSheetModal from "./BottomSheetModal";
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface LogoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLogoUrl: string | null;
    onLogoUpdate?: (logoUrl: string) => void; // legacy: dataURL string
    onConfirm?: (file: File | null) => void | Promise<void>; // File or null to remove
    isProcessing?: boolean;
    title?: string;
    subtitle?: string;
    maxSizeMB?: number;
}

type EditMode = 'preview' | 'crop' | 'filters';

interface Filters {
    brightness: number;
    contrast: number;
    saturate: number;
    grayscale: number;
    sepia: number;
    blur: number;
}

export const LogoUploadModal = ({
    isOpen,
    onClose,
    currentLogoUrl,
    onLogoUpdate,
    onConfirm,
    isProcessing = false,
    title,
    subtitle,
    maxSizeMB = 5
}: LogoUploadModalProps) => {
    const { t } = useTranslation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editMode, setEditMode] = useState<EditMode>('preview');
    
    // Crop states
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    
    // Filters states
    const [filters, setFilters] = useState<Filters>({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        blur: 0
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const dataUrlToBlob = async (dataUrl: string): Promise<{ blob: Blob; mimeType: string }> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return { blob, mimeType: blob.type || 'image/jpeg' };
    };

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
            // Reset crop and filters
            setEditMode('preview');
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setFilters({
                brightness: 100,
                contrast: 100,
                saturate: 100,
                grayscale: 0,
                sepia: 0,
                blur: 0
            });
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

    // Crop complete callback
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Create cropped image
    const createCroppedImage = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0
    ): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return canvas.toDataURL('image/jpeg', 0.95);
    };

    // Helper to create image
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    // Apply crop
    const handleApplyCrop = async () => {
        if (logoPreview && croppedAreaPixels) {
            try {
                const croppedImage = await createCroppedImage(
                    logoPreview,
                    croppedAreaPixels,
                    rotation
                );
                setLogoPreview(croppedImage);
                setEditMode('preview');
                // Reset crop values
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setRotation(0);
            } catch (e) {
                console.error('Error creating cropped image:', e);
            }
        }
    };

    // Apply filters
    const handleApplyFilters = () => {
        if (logoPreview && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Apply CSS filters to canvas
                ctx!.filter = `
                    brightness(${filters.brightness}%)
                    contrast(${filters.contrast}%)
                    saturate(${filters.saturate}%)
                    grayscale(${filters.grayscale}%)
                    sepia(${filters.sepia}%)
                    blur(${filters.blur}px)
                `;
                
                ctx!.drawImage(img, 0, 0);
                
                const filteredImage = canvas.toDataURL('image/jpeg', 0.95);
                setLogoPreview(filteredImage);
                setEditMode('preview');
            };

            img.src = logoPreview;
        }
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            grayscale: 0,
            sepia: 0,
            blur: 0
        });
    };

    // Handle logo update
    const handleUpdateLogo = async () => {
        if (!logoPreview) return;
        try {
            if (onConfirm) {
                const { blob, mimeType } = await dataUrlToBlob(logoPreview);
                const fileExt = mimeType.includes('png') ? 'png' : 'jpg';
                const fileName = `company-logo-${Date.now()}.${fileExt}`;
                const file = new File([blob], fileName, { type: mimeType });
                await onConfirm(file);
                handleClose();
            } else if (onLogoUpdate) {
                onLogoUpdate(logoPreview);
                handleClose();
            }
        } catch (e) {
            console.error('Error confirming logo:', e);
        }
    };

    // Set initial preview when modal opens
    let effectivePreview = logoPreview || currentLogoUrl;

    // Handle logo removal
    const handleRemoveLogo = async () => {
        try {
            // Clear local preview and reset edit mode
            setLogoPreview(null);
            setEditMode('preview');
            
            // Clear crop/filter states
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setFilters({
                brightness: 100,
                contrast: 100,
                saturate: 100,
                grayscale: 0,
                sepia: 0,
                blur: 0
            });
            
            // Call onConfirm with null to signal "save without logo"
            if (onConfirm) {
                await onConfirm(null as any); // null = remove logo
            }
            
            //handleClose();
        } catch (e) {
            console.error('Error removing logo:', e);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setLogoPreview(null);
        setIsDragging(false);
        setEditMode('preview');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            grayscale: 0,
            sepia: 0,
            blur: 0
        });
        onClose();
    };

    

    // Get current filter style
    const getFilterStyle = () => ({
        filter: `
            brightness(${filters.brightness}%)
            contrast(${filters.contrast}%)
            saturate(${filters.saturate}%)
            grayscale(${filters.grayscale}%)
            sepia(${filters.sepia}%)
            blur(${filters.blur}px)
        `
    });

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title || t("update-company-logo", "Update Company Logo")}
            subtitle={subtitle || t("upload-new-logo", "Upload a new logo for your company")}
            icon="image"
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
            maxWidth="3xl"
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
                    {editMode === 'crop' && (
                        <button
                            type="button"
                            onClick={handleApplyCrop}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">check</span>
                                {t("apply-crop", "Apply Crop")}
                            </span>
                        </button>
                    )}
                    {editMode === 'filters' && (
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">check</span>
                                {t("apply-filters", "Apply Filters")}
                            </span>
                        </button>
                    )}
                    {editMode === 'preview' && (
                        <button
                            type="button"
                            onClick={handleUpdateLogo}
                            disabled={isProcessing || !logoPreview}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">{isProcessing ? 'hourglass_empty' : 'check'}</span>
                                {t("update-logo", "Update Logo")}
                            </span>
                        </button>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {/* Hidden canvas for filters */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Edit Mode Tabs */}
                {effectivePreview && (
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setEditMode('preview')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                                editMode === 'preview'
                                    ? 'bg-white text-primary shadow-sm font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                            <span className="hidden sm:inline">{t('preview', 'Preview')}</span>
                        </button>
                        <button
                            onClick={() => setEditMode('crop')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                                editMode === 'crop'
                                    ? 'bg-white text-primary shadow-sm font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">crop</span>
                            <span className="hidden sm:inline">{t('crop', 'Crop')}</span>
                        </button>
                        <button
                            onClick={() => setEditMode('filters')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                                editMode === 'filters'
                                    ? 'bg-white text-primary shadow-sm font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            <span className="hidden sm:inline">{t('filters', 'Filters')}</span>
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
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
                    {/* CROP MODE */}
                    {editMode === 'crop' && effectivePreview ? (
                        <div className="space-y-4 p-4">
                            <div className="relative h-80 sm:h-96 bg-gray-900 rounded-lg overflow-hidden">
                                <Cropper
                                    image={effectivePreview}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            
                            {/* Crop Controls */}
                            <div className="space-y-3 bg-white p-4 rounded-lg">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">zoom_in</span>
                                            {t('zoom', 'Zoom')}
                                        </label>
                                        <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">rotate_right</span>
                                            {t('rotation', 'Rotation')}
                                        </label>
                                        <span className="text-sm text-gray-500">{rotation}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={360}
                                        step={1}
                                        value={rotation}
                                        onChange={(e) => setRotation(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : editMode === 'filters' && effectivePreview ? (
                        /* FILTERS MODE - Unified responsive grid */
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Left - Image Preview */}
                                <div className="flex items-center justify-center bg-white rounded-lg p-4">
                                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                                        <img
                                            src={effectivePreview}
                                            alt="Logo with filters"
                                            className="w-full h-full object-contain p-3"
                                            style={getFilterStyle()}
                                        />
                                    </div>
                                </div>

                                {/* Right - Filter Controls */}
                                <div className="bg-white rounded-lg p-4 h-56 sm:h-64 md:h-72 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            {t('adjust-filters', 'Adjust Filters')}
                                        </h4>
                                        <button
                                            onClick={handleResetFilters}
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">restart_alt</span>
                                            {t('reset', 'Reset')}
                                        </button>
                                    </div>

                                    {/* Brightness */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">light_mode</span>
                                                {t('brightness', 'Brightness')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.brightness}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={200}
                                            step={1}
                                            value={filters.brightness}
                                            onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Contrast */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">contrast</span>
                                                {t('contrast', 'Contrast')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.contrast}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={200}
                                            step={1}
                                            value={filters.contrast}
                                            onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Saturation */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">water_drop</span>
                                                {t('saturation', 'Saturation')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.saturate}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={200}
                                            step={1}
                                            value={filters.saturate}
                                            onChange={(e) => setFilters({ ...filters, saturate: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Grayscale */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">filter_b_and_w</span>
                                                {t('grayscale', 'Grayscale')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.grayscale}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={filters.grayscale}
                                            onChange={(e) => setFilters({ ...filters, grayscale: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Sepia */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">photo_filter</span>
                                                {t('sepia', 'Sepia')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.sepia}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={filters.sepia}
                                            onChange={(e) => setFilters({ ...filters, sepia: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Blur */}
                                    <div className="mb-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">blur_on</span>
                                                {t('blur', 'Blur')}
                                            </label>
                                            <span className="text-sm text-gray-500">{filters.blur}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={10}
                                            step={0.5}
                                            value={filters.blur}
                                            onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : effectivePreview ? (
                        /* PREVIEW MODE */
                        <div className="p-8 sm:p-12">
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
                        </div>
                    ) : (
                        /* UPLOAD MODE */
                        <div className="p-8 sm:p-12">
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
                        </div>
                    )}
                </div>

                {/* Requirements Info */}
                {!effectivePreview && (
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
                )}
            </div>
        </BottomSheetModal>
    );
};

export default LogoUploadModal;
