import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPrevious,
  onNext,
  onPageChange,
}) => {
  const render = () => {
    const pages = [];

    // Add first page
    pages.push(
      <button
        key={1}
        className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis-start" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis-end" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // Add last page if more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="pagination-container">
      <button
        className="pagination-nav-btn"
        onClick={onPrevious}
        disabled={!hasPrevPage}
        title="Previous page"
      >
        ← Previous
      </button>

      <div className="pagination-buttons">{render()}</div>

      <button
        className="pagination-nav-btn"
        onClick={onNext}
        disabled={!hasNextPage}
        title="Next page"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
