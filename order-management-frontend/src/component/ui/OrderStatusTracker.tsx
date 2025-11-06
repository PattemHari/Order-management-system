import React from "react";

interface OrderStatusTrackerProps {
  currentStatus: "Pending" | "Order Placed" | "Order Picked" | "Delivered" | "Cancelled";
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  if (currentStatus === "Cancelled") {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="rounded-circle bg-danger d-inline-block p-2"></span>
        <span className="text-danger fw-bold">Cancelled</span>
      </div>
    );
  }

  const steps = ["Pending", "Order Placed", "Order Picked", "Delivered"];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <ul className="list-unstyled d-flex flex-column gap-0 position-relative">
      {steps.map((step, idx) => {
        const isActive = idx <= currentIndex;

        return (
          <li key={idx} className="d-flex align-items-start">
            <div className="d-flex flex-column align-items-center me-2">
              <span
                className={`rounded-circle border d-inline-block ${isActive ? "bg-primary border-primary" : "bg-white border-secondary"} p-2`}
              ></span>
              {idx !== steps.length - 1 && (
                <span className={`border-start ${isActive ? "border-primary" : "border-secondary"} flex-grow-1`} style={{ minHeight: "2rem" }}></span>
              )}
            </div>
            <span className={`${isActive ? "text-primary fw-bold" : "text-secondary"} mt-1`}>
              {step}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default OrderStatusTracker;
