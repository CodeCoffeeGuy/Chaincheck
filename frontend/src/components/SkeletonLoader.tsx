import "./SkeletonLoader.css";

interface SkeletonLoaderProps {
  type?: "text" | "button" | "table" | "card" | "form";
  lines?: number;
  width?: string;
  height?: string;
}

export default function SkeletonLoader({ 
  type = "text", 
  lines = 1, 
  width = "100%",
  height 
}: SkeletonLoaderProps) {
  if (type === "text") {
    return (
      <div className="skeleton-container">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="skeleton skeleton-text"
            style={{
              width: index === lines - 1 ? "80%" : width,
              height: height || "1rem",
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "button") {
    return (
      <div
        className="skeleton skeleton-button"
        style={{ width, height: height || "44px" }}
      />
    );
  }

  if (type === "table") {
    return (
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton skeleton-text" style={{ height: "20px" }} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-table-row">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton skeleton-text" style={{ height: "16px" }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="skeleton-card">
        <div className="skeleton skeleton-text" style={{ width: "60%", height: "24px", marginBottom: "12px" }} />
        <div className="skeleton skeleton-text" style={{ width: "100%", height: "16px", marginBottom: "8px" }} />
        <div className="skeleton skeleton-text" style={{ width: "80%", height: "16px" }} />
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="skeleton-form">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="skeleton-form-group">
            <div className="skeleton skeleton-text" style={{ width: "100px", height: "16px", marginBottom: "8px" }} />
            <div className="skeleton skeleton-text" style={{ width: "100%", height: "44px" }} />
          </div>
        ))}
        <div className="skeleton skeleton-button" style={{ width: "150px", height: "44px", marginTop: "16px" }} />
      </div>
    );
  }

  return null;
}

