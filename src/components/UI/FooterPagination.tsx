import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

interface FooterPaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function FooterPagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange
}: FooterPaginationProps) {

    const [totalPagesItems, setTotalPagesItems] = useState(totalPages);

    useEffect(() => {

        setTotalPagesItems(totalPages)

    }, [totalPages])


    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value) || 10;
        onItemsPerPageChange?.(value);
        onPageChange(1); // reset page to 1
    };

    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 ">
                <label className="mr-2" htmlFor="rows_per_page">Rows per page: </label>
                <select id="rows_per_page" value={itemsPerPage} onChange={handleItemsPerPageChange} className="w-24 border border-gray-300 rounded-md py-1 px-2 focus:ring-primary focus:border-primary">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPagesItems}
                onPageChange={onPageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
            />
        </div>
    )
}