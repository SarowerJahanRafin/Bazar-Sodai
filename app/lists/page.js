"use client";
import { useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import ShowItem from "@/app/components/showItem";


export default function ShoppingListViewer() {
    const [date, setDate] = useState(""); // For selecting the date
    const [items, setItems] = useState([]); // For storing fetched items
    const [error, setError] = useState(""); // For error handling
    const [loading, setLoading] = useState(false); // For showing loading state
    const [isEditing, setIsEditing] = useState(false); // Manage edit modal visibility
    const [currentItem, setCurrentItem] = useState(null); // Track item being edited
    const [editedName, setEditedName] = useState(""); // Edited item name
    const [editedQuantity, setEditedQuantity] = useState(""); // Edited quantity
    const [editedDescription, setEditedDescription] = useState(""); // Edited description
    const myEmail = "sjrafin123@gmail.com"; // Replace with actual user email

    // Fetch shopping list items from Firebase based on selected date
    const fetchItems = async () => {
        setLoading(true);
        setError(""); // Clear any previous error
        try {
            const collectionRef = collection(db, `${myEmail}/lists/${date}`);
            const querySnapshot = await getDocs(collectionRef);
            const fetchedItems = querySnapshot.docs.map((doc) => ({
                id: doc.id, // Document ID for future update
                ...doc.data(),
            }));
            setItems(fetchedItems);
        } catch (error) {
            setError("Failed to fetch the list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Toggle the "done" status of an item
    const handleCheckboxChange = (index) => {
        const updatedItems = [...items];
        updatedItems[index].isDone = !updatedItems[index].isDone;
        setItems(updatedItems);
    };

    // Open the edit modal with the selected item
    const openEditModal = (item) => {
        setCurrentItem(item);
        setEditedName(item.itemName);
        setEditedQuantity(item.quantity);
        setEditedDescription(item.description || ""); // Load description if available
        setIsEditing(true);
    };

    // Save the edited item
    const saveEditedItem = () => {
        const updatedItems = items.map((item) =>
            item.id === currentItem.id
                ? { ...item, itemName: editedName, quantity: editedQuantity, description: editedDescription }
                : item
        );
        setItems(updatedItems);
        setIsEditing(false); // Close modal after editing
    };

    // Update the list in Firebase when the user submits the changes
    const updateItems = async () => {
        try {
            items.forEach(async (item) => {
                const docRef = doc(db, `${myEmail}/lists/${date}`, item.id);
                await updateDoc(docRef, { itemName: item.itemName, quantity: item.quantity, description: item.description, isDone: item.isDone });
            });
            alert("List updated successfully!");
        } catch (error) {
            setError("Failed to update the list. Please try again.");
        }
    };

    // Delete item from Firebase and the UI
    const deleteItem = async (itemId, itemName, quantity) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${itemName} - ${quantity}"?`);

        if (confirmDelete) {
            try {
                // Remove item from Firebase
                const docRef = doc(db, `${myEmail}/lists/${date}`, itemId);
                await deleteDoc(docRef);

                // Remove item from UI
                setItems(items.filter((item) => item.id !== itemId));
                alert("Item deleted successfully!");
            } catch (error) {
                setError("Failed to delete the item. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
            <h1 className="text-4xl font-bold text-gray-800 text-center">View Shopping List</h1>
            {/* Date Input */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Select Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Fetch Button */}
            <div className="mt-4 text-center">
                <button
                    onClick={fetchItems}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    disabled={!date || loading}
                >
                    {loading ? "Loading..." : "Fetch List"}
                </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

            {
                (items.length === 0) && <p className="text-center mt-10">No items Found</p>
            }

            {/* List of Items */}
            {items.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-medium text-gray-800 text-center">Items for {date}</h2>
                    <ul className="mt-2 space-y-2">
                        {items.map((item, index) => (
                            <div>
                                <li key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <div>
                                        <span className="block">{item.itemName} - {item.quantity}</span>
                                        {item.description && <span className="text-gray-500 italic">Description: {item.description}</span>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={item.isDone}
                                            onChange={() => handleCheckboxChange(index)}
                                            className="ml-4"
                                        />
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id, item.itemName, item.quantity)}
                                            className="text-red-600 hover:text-red-800 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>


                                {/* <ShowItem key={index} props={item} ></ShowItem> */}
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            {/* Update Button */}
            {items.length > 0 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={updateItems}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        Update List
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Edit Item</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="text"
                                value={editedQuantity}
                                onChange={(e) => setEditedQuantity(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditedItem}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
