"use client";
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, app } from "@/firebase.config";

export default function ShoppingListForm() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState(""); // New description state
    const [createdAt, setCreatedAt] = useState("");
    const [error, setError] = useState("");
    const myEmail = "sjrafin123@gmail.com";
    const userName = "rafin";

    useEffect(() => {
        const currentDateTime = new Date().toLocaleString();
        setCreatedAt(currentDateTime);
    }, []);

    // Add item function
    const addItem = () => {
        if (itemName.trim() && quantity.trim()) {
            setItems([...items, { itemName: itemName.trim(), quantity: quantity.trim(), description: description.trim() }]);
            setItemName("");
            setQuantity("");
            setDescription(""); // Clear the description after adding item
            setError("");
        } else {
            setError("Both item name and quantity are required.");
        }
    };

    // Remove item function
    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (items.length === 0) {
            setError("You must add at least one item before submitting.");
            return;
        }

        // Submit data to Firebase
        const collectionRef = collection(db, `${myEmail}/lists/${date}`);

        items.map((item) => {
            addDoc(collectionRef, {
                itemName: item.itemName,
                quantity: item.quantity,
                description: item.description || null, // Store description or null if empty
                date: date,
                timeOnly: createdAt.split(", ")[1],
                isDone: false
            })
                .then(() => console.log("Document successfully added"))
                .catch((error) => console.error("Error adding document: ", error));
        });

        // Reset form after submission
        setItems([]);
        setDate("");
        alert("Items added into List.");
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
            <h1 className="text-4xl font-bold text-gray-800 text-center">Shopping List</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Date Input */}
                <label className="block text-sm font-medium text-gray-700">Shopping Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    required
                />

                {/* What to Buy and Quantity Input */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">What to Buy</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Enter item name"
                        />
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Quantity"
                        />

                    </div>
                </div>

                {/* Description Input (Optional) */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Add an optional description"
                    />
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="flex justify-center mt-5 items-center">
                    <button
                        type="button"
                        onClick={addItem}
                        className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none "
                    >
                        Add
                    </button>
                </div>

                {/* List of Added Items */}
                {items.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-lg font-medium text-gray-800">Items to Buy</h2>
                        <ul className="mt-2 space-y-2">
                            {items.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <span>{item.itemName} - {item.quantity}</span>
                                    {item.description && <span className="ml-4 text-gray-500 italic">{item.description}</span>}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-6">
                    {(items.length > 0) && <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        Submit
                    </button>}
                </div>
            </form>

            {/* Created At */}
            <p className="mt-4 text-sm text-gray-500 text-center mt-5">Time: {createdAt}</p>
        </div>
    );
}
