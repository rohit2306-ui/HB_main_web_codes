import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Prizes() {
  const { uid } = useParams<{ uid: string }>();
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!uid) return;

      const projectsRef = collection(db, "openProjects");
      const snapshot = await getDocs(projectsRef);

      let coins = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const submissions = data.submissions || [];
        submissions.forEach((sub: any) => {
          if (sub.uid === uid && sub.coinsCredited && data.coins) {
            coins += data.coins; // sum coins from projects where coins credited
          }
        });
      });

      setTotalCoins(coins);
    };

    fetchCoins();
  }, [uid]);

  return (
    <section className="min-h-screen py-16 px-6 bg-black text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-6">
          🎁 Project Completion Prizes
        </h1>
        <p className="text-lg mb-4">
          Hello <span className="font-bold">{uid}</span>, here are your rewards
          for completing projects!
        </p>

        <p className="text-xl font-semibold text-yellow-400 mb-10">
          Total Coins Earned: {totalCoins} 🪙
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">🥇 Gold Prize</h2>
            <p>Complete 10+ tests → Get Amazon Gift Card worth ₹2000</p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">🥈 Silver Prize</h2>
            <p>Complete 5+ tests → Get Swag Kit + Certificate</p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">🥉 Bronze Prize</h2>
            <p>Complete 3+ tests → Get Special Mention on Leaderboard</p>
          </div>
        </div>
      </div>
    </section>
  );
}
