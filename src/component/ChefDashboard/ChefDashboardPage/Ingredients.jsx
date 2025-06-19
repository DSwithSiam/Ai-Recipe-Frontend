import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import {
    useDeletIngradientsDataMutation,
  useGetIngradientsDataQuery,
  usePustIngradientsDataMutation,
  usePutIngradientsDataMutation,
} from '../../../Rudux/feature/ApiSlice';

function Ingredients() {
  const { id } = useParams(); // Recipe ID from URL
  const { data: ingredientsData } = useGetIngradientsDataQuery(id);
  const [putIngredientsData] = usePutIngradientsDataMutation();
  const [DeletIngradientsData] = useDeletIngradientsDataMutation();
  const [PustIngradientsData] = usePustIngradientsDataMutation();

  const [formData, setFormData] = useState({
    ingredients: [],
  });

  // Load backend data into form
  useEffect(() => {
    console.log('ingredientsData:', ingredientsData); // Debug incoming data
    const incoming = ingredientsData?.ingredients || ingredientsData?.data;
    if (Array.isArray(incoming)) {
      const formatted = incoming.map((item) => {
        console.log('item id:', item.id); // Log each item's id
        return {
          id: item.id || '', // Ensure id is included, empty string for new ingredients
          name: item.name || '',
          quantity: item.quantity || '',
          unit: item.unit || '',
          isEditable: false, // Default to non-editable
        };
      });
      setFormData({ ingredients: formatted });
    }
  }, [ingredientsData]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  // const toggleIngredientEdit = async (index) => {
  //   const updated = [...formData.ingredients];
  //   const isCurrentlyEditable = updated[index].isEditable;

  //   // If user is saving (was in edit mode)
  //   if (isCurrentlyEditable) {
  //     const { id, name, quantity, unit } = updated[index]; // Include id
  //     const payload = 
       
  //         {
          
  //           name,
  //           quantity,
  //           unit,
  //         };
        
      

  //     console.log('payload:', payload); // Debug payload
  //     try {
  //       const result = await putIngredientsData({ id, form: payload }).unwrap();
  //       console.log('Update result:', result); // Debug API response
  //       toast.success('Ingredient updated!');

  //       // If the backend returns a new id for a newly created ingredient, update it
  //       if (!id && result?.ingredients?.[0]?.id) {
  //         updated[index].id = result.ingredients[0].id; // Update id in local state
  //       }
  //     } catch (err) {
  //       toast.error('Failed to update!');
  //       console.error('Error:', err);
  //     }
  //   }

  //   // Toggle edit mode
  //   updated[index].isEditable = !isCurrentlyEditable;
  //   setFormData({ ...formData, ingredients: updated });
  // };



  const toggleIngredientEdit = async (index) => {
  const updated = [...formData.ingredients];
  const isCurrentlyEditable = updated[index].isEditable;

  if (isCurrentlyEditable) {
    const { id: ingredientId, name, quantity, unit } = updated[index];
    const payload = { name, quantity, unit };

    try {
      let result;

      if (ingredientId) {
        // PUT for existing ingredient
        result = await putIngredientsData({ id: ingredientId, form: payload }).unwrap();
        toast.success('Ingredient updated!');
      } else {
        // POST for new ingredient
        result = await PustIngradientsData({ formattedData: payload, id }).unwrap();
        toast.success('Ingredient added!');

        // Update the local ingredient with returned ID (assuming backend returns ID)
        if (result?.ingredients?.[0]?.id) {
          updated[index].id = result.ingredients[0].id;
        }
      }

      console.log('Result:', result);
    } catch (err) {
      toast.error('Failed to save ingredient!');
      console.error('Save error:', err);
      return;
    }
  }

  // Toggle edit mode
  updated[index].isEditable = !isCurrentlyEditable;
  setFormData({ ...formData, ingredients: updated });
};

  const addIngredient = () => {
    const newItem = {
      id: '', // No id for new ingredients until saved
      name: '',
      quantity: '',
      unit: '',
      isEditable: true, // New ingredients start in edit mode
    };
    setFormData({
      ingredients: [...formData.ingredients, newItem],
    });
  };

const deleteIngredient = async (index) => {
  const updated = [...formData.ingredients];
  const ingredientToDelete = updated[index];

  // If it has an ID, delete from the backend
  if (ingredientToDelete.id) {
    try {
      await DeletIngradientsData(ingredientToDelete.id).unwrap();
      toast.success('Ingredient deleted from backend!');
    } catch (err) {
      toast.error('Failed to delete from backend!');
      console.error('Delete error:', err);
      return; // Stop here if deletion failed
    }
  }

  // Remove from local state
  updated.splice(index, 1);
  setFormData({ ...formData, ingredients: updated });
};


  return (
    <div className="border border-gray-200 p-4 rounded-2xl mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Recipe Ingredients</h2>
        <LuPlus
          onClick={addIngredient}
          className="text-[#5B21BD] cursor-pointer text-2xl"
        />
      </div>

      {formData.ingredients.map((ingredient, index) => (
        <div key={index} className="flex text-[#999999] gap-4 my-6 items-center">
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            placeholder="Dark chocolate"
            className="w-[40%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
            disabled={!ingredient.isEditable}
          />
          <input
            type="text"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            placeholder="200"
            className="w-[20%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] text-center py-3 px-3"
            disabled={!ingredient.isEditable}
          />
          <input
            type="text"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            placeholder="g"
            className="w-[40%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
            disabled={!ingredient.isEditable}
          />
          <button
            type="button"
            onClick={() => toggleIngredientEdit(index)}
            className="text-sm text-white bg-[#5B21BD] w-14 py-3 rounded-[6px] cursor-pointer"
          >
            {ingredient.isEditable ? 'Save' : 'Edit'}
          </button>
          <LuTrash2
            onClick={() => deleteIngredient(index)}
            className="text-[#FF0000] cursor-pointer text-xl border rounded size-10 p-2"
          />
        </div>
      ))}
    </div>
  );
}

export default Ingredients;


