import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUser } from '../utils/auth';
import { Character, InventoryItem, Quest, ShopItem } from '../../../interfaces/mmorpg.interface';
import { battle, levelUp, getInventory, getShopItems, purchaseItem } from '../../../utils/api';

const MMORPG = ({ character }: { character: Character }) => {
  const { data: session } = useSession();
  const { getUser } = useUser();
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem>(null);
  const [battleTarget, setBattleTarget] = useState('');
  const [battleResult, setBattleResult] = useState<BattleResult>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest>(null);
  const [levelUpResult, setLevelUpResult] = useState<LevelUpResult>(null);

  useEffect(() => {
    if (session) {
      getUser().then((user) => {
        setUser(user);
        fetchInventory();
        fetchShopItems();
      });
    }
  }, [session]);

  const fetchInventory = async () => {
    try {
      const fetchedInventory = await getInventory();
      setInventory(fetchedInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchShopItems = async () => {
    try {
      const fetchedShopItems = await getShopItems();
      setShopItems(fetchedShopItems);
    } catch (error) {
      console.error('Error fetching shop items:', error);
    }
  };

  const handleLevelUp = async () => {
    try {
      const result = await levelUp();
      setLevelUpResult(result);
    } catch (error) {
      console.error('Error leveling up:', error);
    }
  };

  const handleBattle = async () => {
    try {
      const result = await battle(battleTarget);
      setBattleResult(result);
    } catch (error) {
      console.error('Error battling:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      const result = await purchaseItem(selectedShopItem.id);
      if (result.success) {
        fetchInventory();
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">MMORPG Character</h2>
      <div className="flex items-center mb-4">
        <img
          src={character.profilePicture || '/images/default-avatar.png'}
          alt="Character Avatar"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-bold mb-1">{character.name}</h3>
          <p className="text-gray-600">Level: {character.level}</p>
          <p className="text-gray-600">Experience: {character.experience}</p>
          <p className="text-gray-600">Coins: {character.coins}</p>
        </div>
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLevelUp}
        >
          Level Up
        </button>
        {levelUpResult && (
          <p className={`text-green-500 ${levelUpResult.success ? '' : 'text-red-500'}`}>
            {levelUpResult.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Inventory</h3>
        <ul>
          {inventory.map((item) => (
            <li key={item.id} className="text-gray-700 mb-1">
              {item.name}: {item.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Shop</h3>
        <ul>
          {shopItems.map((item) => (
            <li
              key={item.id}
              className={`text-gray-700 mb-1 cursor-pointer ${
                selectedShopItem?.id === item.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => setSelectedShopItem(item)}
            >
              {item.name}: {item.description} (Price: {item.price} coins)
            </li>
          ))}
        </ul>
        {selectedShopItem && (
          <div className="mt-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePurchase}
            >
              Purchase
            </button>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Battle</h3>
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Enter battle target"
          value={battleTarget}
          onChange={(e) => setBattleTarget(e.target.value)}
        />
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleBattle}
        >
          Battle
        </button>
        {battleResult && (
          <p className={`text-green-500 ${battleResult.success ? '' : 'text-red-500'}`}>
            {battleResult.message}
          </p>
        )}
      </div>
      {/ Add more MMORPG elements (quests, etc.) here /}
    </div>
  );
};

export default MMORPG;