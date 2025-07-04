import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/api";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/repository/")({
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }
  },
  component: RepositoryListPage,
});

function RepositoryListPage() {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshingId, setRefreshingId] = useState<number | null>(null);

  const fetchRepositories = () => {
    setLoading(true);
    setError("");
    api<any[]>("/repositories")
      .then((data) => setRepositories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    api<any[]>("/repositories")
      .then((data) => {
        if (mounted) setRepositories(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this repository?"))
      return;
    try {
      await api(`/repositories/${id}`, { method: "DELETE" });
      setRepositories((repos) => repos.filter((r) => r.id !== id));
    } catch (err: any) {
      alert("Error deleting repository: " + err.message);
    }
  };

  const handleRefresh = async (id: number) => {
    setRefreshingId(id);
    try {
      await api(`/repositories/${id}/refresh`, { method: "PATCH" });
      fetchRepositories();
    } catch (err: any) {
      alert("Error refreshing repository: " + err.message);
    } finally {
      setRefreshingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repositories</h1>
        <Button asChild>
          <Link to="/repository/add">Add Repository</Link>
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : repositories.length === 0 ? (
        <ul className="divide-y">
          <li className="py-4">No repositories yet.</li>
        </ul>
      ) : (
        <ul className="divide-y">
          {repositories.map((repo) => (
            <li key={repo.id || repo.name} className="py-4">
              <div className="flex flex-col gap-1">
                <div>
                  <b>Owner:</b> {repo.owner}
                </div>
                <div>
                  <b>Project Name:</b> {repo.name}
                </div>
                <div>
                  <b>Project URL:</b>{" "}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {repo.url}
                  </a>
                </div>
                <div>
                  <b>Stars:</b> {repo.stars}
                </div>
                <div>
                  <b>Forks:</b> {repo.forks}
                </div>
                <div>
                  <b>Open Issues:</b> {repo.openIssues}
                </div>
                <div>
                  <b>Created At (UTC Unix timestamp):</b> {repo.createdAtUnix}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh(repo.id)}
                    disabled={refreshingId === repo.id}
                  >
                    {refreshingId === repo.id ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(repo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
