import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than or equal to maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                        ${currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                        ${currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                {totalItems && itemsPerPage && (
                    <div className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span>
                        {' '}-{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                        {' '}of{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}results
                    </div>
                )}
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
                                ${currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className="sr-only">Previous</span>
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => onPageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${currentPage === page
                                            ? 'z-10 bg-primary text-white border-primary'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span
                                    key={index}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                >
                                    ...
                                </span>
                            )
                        ))}
                        
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
                                ${currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className="sr-only">Next</span>
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;