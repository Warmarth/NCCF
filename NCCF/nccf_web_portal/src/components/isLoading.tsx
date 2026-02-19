interface IsLoadingProps {
    isLoading: boolean;
}

function IsLoading({ isLoading }: IsLoadingProps) {
    return (
      isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="admin-loading-state">
            <div className="loading-spinner-premium"></div>
            <p>Retrieving platform data...</p>
          </div>
        </div>
      )
    );
}

export default IsLoading;