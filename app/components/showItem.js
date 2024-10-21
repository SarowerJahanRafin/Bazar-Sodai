import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

export default function ShowItem(item) {

    // console.log(props);
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
        <div>
            {/* <p>Hello</p> */}
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


        </div>
    )
}
