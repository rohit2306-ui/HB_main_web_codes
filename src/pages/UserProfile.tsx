import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, UserPlus, Users, Trophy, MapPin, Share2, Edit } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <div className="relative">
        <div className="h-40 sm:h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 mb-8 sm:mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl sm:text-4xl font-bold flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">@{user.username}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />Joined {formatDate(user.joinedDate)}</span>
                    <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" />{communities.length} Communities</span>
                    <span className="inline-flex items-center gap-2"><Trophy className="w-4 h-4" />{hackathons.length} Hackathons</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(-1)} className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Back</button>
                  <button className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2"><Edit className="w-4 h-4" /> Edit Profile</button>
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Communities */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Joined Communities</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Groups you’re a part of</p>
                </div>
              </div>
              <div className="p-6">
                {communities.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">Not part of any communities yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {communities.map((comm) => (
                      <li key={comm.id} className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{comm.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{comm.description}</div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Hackathons */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registered Hackathons</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your participation history</p>
                </div>
              </div>
              <div className="p-6">
                {hackathons.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No hackathons registered yet.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hackathons.map((hack) => (
                      <li key={hack.id} className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-yellow-500/50 transition cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{hack.title}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2"><MapPin className="w-3 h-3" /> {formatDate(hack.date)}</div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
