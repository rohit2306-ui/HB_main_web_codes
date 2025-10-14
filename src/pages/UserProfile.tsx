import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, UserPlus } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';

interface Community {
  id: string;
  name: string;
  description: string;
}

interface Hackathon {
  id: string;
  title: string;
  date: string;
}

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  joinedDate: string;
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const userSnap = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
        if (userSnap.empty) {
          setNotFound(true);
          return;
        }
        const userData = userSnap.docs[0].data() as UserProfileData;
        setUser({ id: userSnap.docs[0].id, ...userData });

        const commSnap = await getDocs(query(collection(db, 'communities'), where('members', 'array-contains', userSnap.docs[0].id)));
        const commList: Community[] = commSnap.docs.map(d => ({ id: d.id, ...(d.data() as Community) }));
        setCommunities(commList);

        const hackSnap = await getDocs(query(collection(db, 'hackathons'), where('participants', 'array-contains', userSnap.docs[0].id)));
        const hackList: Hackathon[] = hackSnap.docs.map(d => ({ id: d.id, ...(d.data() as Hackathon) }));
        setHackathons(hackList);

      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Invalid date' : parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (notFound) return <Navigate to="/search" replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><LoadingSpinner size="lg" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 text-gray-100">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-6 space-y-4 md:space-y-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold transition-transform transform hover:scale-105">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400 text-lg">@{user.username}</p>

              {/* Stats */}
              <div className="flex space-x-6 mt-2 text-gray-300 text-sm">
                <div className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                  <UserPlus className="h-5 w-5" />
                  <span>{communities.length} Communities</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-yellow-400 transition-colors">
                  <span className="font-semibold">{hackathons.length}</span>
                  <span>Hackathons</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communities */}
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Joined Communities</h2>
          {communities.length === 0 ? (
            <p className="text-gray-400">Not part of any communities yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {communities.map(comm => (
                <li key={comm.id} className="p-4 rounded-xl bg-gray-900/40 hover:bg-indigo-700/30 transition transform hover:scale-105 cursor-pointer">
                  {comm.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hackathons */}
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4">Registered Hackathons</h2>
          {hackathons.length === 0 ? (
            <p className="text-gray-400">No hackathons registered yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hackathons.map(hack => (
                <li key={hack.id} className="p-4 rounded-xl bg-gray-900/40 hover:bg-teal-700/30 transition transform hover:scale-105 cursor-pointer">
                  <span className="font-semibold">{hack.title}</span>
                  <span className="block text-gray-300 text-sm">{formatDate(hack.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
