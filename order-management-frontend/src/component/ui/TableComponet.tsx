import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Column {
  key: string;
  label: string;
  render?: (item: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  title?: string;
  itemsPerPage?: number;
}

const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  title,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="table-responsive shadow-lg rounded-4 p-4">
      {title && (
        <h4 className="text-center text-primary fw-bold mb-3">{title}</h4>
      )}

      <table className="table table-hover table-striped table-bordered align-middle mb-0 rounded-4 overflow-hidden">
        <thead className="table-primary text-center">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-muted py-4">
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((item, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render
                      ? col.render(item, startIndex + index)
                      : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={handlePrev}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button className="page-link" onClick={handleNext}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TableComponent;
