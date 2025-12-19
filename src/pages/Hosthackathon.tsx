import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createHackathon } from "../services/hackathonService";
import { addCreatedHackathonToUser } from "../services/userService";
import {
  Calendar,
  MapPin,
  Video,
  Image as ImageIcon,
  UploadCloud,
  Award,
  DollarSign,
} from "lucide-react";

const Hosthackathon: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const uploadImageIfNeeded = async (): Promise<string | undefined> => {
    if (!imageFile) return thumbnail || undefined;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      // Graceful fallback: ask user to provide URL, keep no upload
      setError(
        "Image upload is not configured. Please add Cloudinary env vars or provide a thumbnail URL."
      );
      return undefined;
    }
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "hackathons");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.secure_url as string;
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. You can try again or paste a URL.");
      return undefined;
    } finally {
      setUploadingImage(false);
    }
  };

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
      const finalThumbnail = await uploadImageIfNeeded();
      const id = await createHackathon({
        name: name.trim(),
        description: description.trim(),
        date: date || undefined,
        closeDate: closeDate || undefined,
        place: place || undefined,
        city: city || undefined,
        theme: theme || undefined,
        price: price || undefined,
        thumbnail: finalThumbnail || undefined,
        isOnline,
        createdBy: user.uid,
      });
      // Store reference under user's profile
      await addCreatedHackathonToUser(user.uid, id);
      navigate(`/hackathon/${id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create hackathon. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Host a Hackathon</h1>
        <p className="mt-3 text-white/90 max-w-2xl">
          Create an eye-catching listing with a hero image, theme, and venue details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Hackathon Name</label>
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., CodeSprint 2025"
              />
              <Award className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
              rows={6}
              placeholder="Share the purpose, rules, and what participants can expect"
            />
          </div>

          {/* Schedule & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                />
                <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Registration Close Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                />
                <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Event Mode</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOnline(false)}
                  className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    !isOnline
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <MapPin className="inline-block w-4 h-4 mr-2" /> In-Person
                </button>
                <button
                  type="button"
                  onClick={() => setIsOnline(true)}
                  className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    isOnline
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <Video className="inline-block w-4 h-4 mr-2" /> Online
                </button>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          {!isOnline && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Place / Venue</label>
                <input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Venue name or address"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="City"
                />
              </div>
            </div>
          )}

          {/* Theme & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Theme (optional)</label>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., AI • Web3 • Sustainability"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Price (optional)</label>
              <div className="relative">
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Free / $10 / ₹199"
                />
                <DollarSign className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Hackathon Image</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="text-sm">Upload an image to showcase your event</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50">
                    <UploadCloud className="w-4 h-4 mr-2" /> Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {uploadingImage && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Or paste an image URL</label>
                <input
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/banner.jpg"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">If you upload a file, we will store it via Cloudinary when you submit.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setDate("");
                setCloseDate("");
                setIsOnline(false);
                setPlace("");
                setCity("");
                setTheme("");
                setPrice("");
                setThumbnail("");
                setImageFile(null);
                setImagePreview("");
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Hackathon"}
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
              {imagePreview || thumbnail ? (
                <img
                  src={imagePreview || thumbnail}
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{name || "Your Hackathon Name"}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {date && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                    <Calendar className="w-4 h-4" /> {date}
                  </span>
                )}
                {closeDate && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                    <Calendar className="w-4 h-4" /> Closes: {closeDate}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-gray-700 dark:text-gray-200 ${
                    isOnline
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                      : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Video className="w-4 h-4" /> Online
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" /> {city || "Venue"}
                    </>
                  )}
                </span>
                {theme && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800">
                    <Award className="w-4 h-4" /> {theme}
                  </span>
                )}
                {price && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700">
                    <DollarSign className="w-4 h-4" /> {price}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {description || "Your description preview will appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hosthackathon;
