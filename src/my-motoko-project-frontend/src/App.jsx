import { useState, useEffect } from "react";
import { my_motoko_project_backend } from "declarations/my-motoko-project-backend";
import "./index.scss";

function App() {
  const [commitMessage, setCommitMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [response, setResponse] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingCommit, setDeletingCommit] = useState(null);

  // Load commits when component mounts
  useEffect(() => {
    loadCommits();
  }, []);

  // Function to load all commits
  async function loadCommits() {
    try {
      const allCommits = await my_motoko_project_backend.getCommits();
      setCommits(allCommits);
    } catch (error) {
      console.error("Error loading commits:", error);
    }
  }

  // Function to format timestamp
  function formatTimestamp(timestamp) {
    // Convert nanoseconds to milliseconds
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const message = commitMessage;
    const authorName = author || "Anonymous";

    try {
      // Call the addCommit method
      const res = await my_motoko_project_backend.addCommit(
        authorName,
        message
      );
      setResponse(res);

      // Reload commits to show the new one
      await loadCommits();

      // Clear form
      setCommitMessage("");
      setAuthor("");
    } catch (error) {
      console.error("Error adding commit:", error);
      setResponse("❌ Error adding commit");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCommit(timestamp) {
    setDeletingCommit(timestamp);

    try {
      const res = await my_motoko_project_backend.deleteCommitByTimestamp(
        timestamp
      );
      setResponse(res);

      // Reload commits to reflect the deletion
      await loadCommits();
    } catch (error) {
      console.error("Error deleting commit:", error);
      setResponse("❌ Error deleting commit");
    } finally {
      setDeletingCommit(null);
    }
  }

  return (
    <main className="app">
      <div className="logo">
        <img src="/logo.svg" alt="ChainHub logo" />
        X
        <img src="/logo2.svg" alt="ICP" />
      </div>

      <h1 className="title">ChainHub ICP</h1>
      <p className="description">
        GitHub On-Chain for Coordinated Deployment and Sovereign Governance of
        Web3 + DePIN Infrastructure.
      </p>

      <div className="form-container">
        <div className="form-group">
          <label htmlFor="author" className="label">
            Author Name:
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input"
            placeholder="e.g., Developer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="commit" className="label">
            Commit Message:
          </label>
          <textarea
            id="commit"
            name="commit"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="textarea"
            placeholder="e.g., Added new feature for user authentication&#10;&#10;- Implemented JWT token validation&#10;- Added password encryption&#10;- Updated user schema"
            rows="4"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !commitMessage.trim()}
          className={`btn btn-primary ${
            loading || !commitMessage.trim() ? "btn-disabled" : ""
          }`}
        >
          {loading ? "Adding..." : "Submit Commit"}
        </button>
      </div>

      {response && (
        <section className="response">
          <p className="response-text">{response}</p>
        </section>
      )}

      <section className="commits-section">
        <div className="commits-header">
          <h2 className="commits-title">Commit History</h2>
          <button onClick={loadCommits} className="btn btn-secondary">
            Refresh
          </button>
        </div>

        {commits.length === 0 ? (
          <p className="no-commits">
            No commits yet. Add your first commit above!
          </p>
        ) : (
          <div className="commits-list">
            {commits.map((commit, index) => (
              <div key={index} className="commit-card">
                <div className="commit-header">
                  <span className="commit-author">{commit.author}</span>
                  <div className="commit-actions">
                    <span className="commit-timestamp">
                      {formatTimestamp(commit.timestamp)}
                    </span>
                    <button
                      onClick={() => handleDeleteCommit(commit.timestamp)}
                      disabled={deletingCommit === commit.timestamp}
                      className="btn btn-delete"
                      title="Delete commit"
                    >
                      {deletingCommit === commit.timestamp ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>
                <p className="commit-message">{commit.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
