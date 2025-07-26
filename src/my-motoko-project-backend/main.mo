import Array "mo:base/Array";
import Time "mo:base/Time";

persistent actor {
  // Define a commit structure
  type Commit = {
    author: Text;
    message: Text;
    timestamp: Int;
  };

  // Mutable list of commits
  transient var commits: [Commit] = [];

  // Public function to add a commit
  public func addCommit(author: Text, message: Text) : async Text {
    let timestamp = Time.now();
    let commit : Commit = {
      author = author;
      message = message;
      timestamp = timestamp;
    };
    commits := Array.append(commits, [commit]);
    return "✅ Commit added by " # author;
  };

  // Public function to delete a commit by index
  public func deleteCommit(index: Nat) : async Text {
    if (index >= commits.size()) {
      return "❌ Invalid commit index";
    };
    
    // Create new array without the commit at the specified index
    let newCommits = Array.tabulate<Commit>(commits.size() - 1, func(i) {
      if (i < index) {
        commits[i]
      } else {
        commits[i + 1]
      }
    });
    
    commits := newCommits;
    return "✅ Commit deleted successfully";
  };

  // Public function to delete a commit by timestamp (more reliable)
  public func deleteCommitByTimestamp(timestamp: Int) : async Text {
    let newCommits = Array.filter<Commit>(commits, func(commit) {
      commit.timestamp != timestamp
    });
    
    if (newCommits.size() == commits.size()) {
      return "❌ Commit not found";
    };
    
    commits := newCommits;
    return "✅ Commit deleted successfully";
  };

  // Public query function to get all commits
  public query func getCommits() : async [Commit] {
    return commits;
  };

  // Public query function to get commit count
  public query func getCommitCount() : async Nat {
    return commits.size();
  };

  // Keep the old greet function if needed
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}