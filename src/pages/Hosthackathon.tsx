import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createHackathon } from "../services/hackathonService";

const Hosthackathon: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("You must be logged in to host a hackathon.");
      return;
    }
    if (!name.trim() || !description.trim()) {
      setError("Please provide a name and description.");
      return;
    }
    setLoading(true);
    try {
      const id = await createHackathon({
        name: name.trim(),
        description: description.trim(),
        date: date || undefined,
        place: place || undefined,
        city: city || undefined,
        thumbnail: thumbnail || undefined,
        isOnline,
        createdBy: user.uid,
      });
      navigate(`/hackathon/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create hackathon. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Host a Hackathon</h1>
      <p className="text-sm text-gray-600 mb-6">Fill in the details below to create a hackathon listing.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Hackathon name" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" rows={5} placeholder="Short description and rules" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Online event?</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center"><input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} className="mr-2" /> Yes</label>
            </div>
          </div>
        </div>

        {!isOnline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Place / Venue</label>
              <input value={place} onChange={(e) => setPlace(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Venue name or address" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="City" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL (optional)</label>
          <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="https://..." />
        </div>

        <div className="flex items-center justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {loading ? "Creating..." : "Create Hackathon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Hosthackathon;
