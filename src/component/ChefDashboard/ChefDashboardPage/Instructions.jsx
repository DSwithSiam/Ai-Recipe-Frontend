import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { useDeletInstructionsDataMutation, useGetInstructionDataQuery, usePustInstructionsDataMutation, usePutInstructionDataMutation } from '../../../Rudux/feature/ApiSlice';

function Instructions() {
  const { id } = useParams(); // Recipe ID from URL
  const { data: instructionData } = useGetInstructionDataQuery(id);
  const [putInstructionData] = usePutInstructionDataMutation();
  const [DeletInstructionsData] = useDeletInstructionsDataMutation();
  const [PustInstructionsData] = usePustInstructionsDataMutation();

  const [formData, setFormData] = useState({
    instructions: [],
  });
console.log('formData:', formData); // Debug initial form data
  // Load backend data into form
  useEffect(() => {
    console.log('instructionData:', instructionData); // Debug incoming data
    const incoming = instructionData?.instructions || instructionData?.data;
    if (Array.isArray(incoming)) {
      const formatted = incoming.map((item) => {
        console.log('item id:', item.id); // Log each item's id
        return {
          id: item.id || '', // Ensure id is included, empty string for new instructions
          text: item.text || '',
          isEditable: false, // Default to non-editable
        };
      });
      setFormData({ instructions: formatted });
    }
  }, [instructionData]);

  // Handle instruction change
  const handleInstructionChange = (index, value) => {
    const updated = [...formData.instructions];
    updated[index].text = value;
    setFormData({ ...formData, instructions: updated });
  };

  // Toggle edit/save and update backend
  // const toggleInstructionEdit = async (index) => {
  //   const updated = [...formData.instructions];
  //   const isCurrentlyEditable = updated[index].isEditable;

  //   // If user is saving (was in edit mode)
  //   if (isCurrentlyEditable) {
  //     const { id, text } = updated[index]; // Include id
  //     const payload = {
  //       text,
  //     };

  //     console.log('payload:', payload); // Debug payload
  //     try {
  //       const result = await putInstructionData({ id, form: payload }).unwrap();
  //       console.log('Update result:', result); // Debug API response
  //       toast.success('Instruction updated!');

  //       // If the backend returns a new id for a newly created instruction, update it
  //       if (!id && result?.instructions?.[0]?.id) {
  //         updated[index].id = result.instructions[0].id; // Update id in local state
  //       }
  //     } catch (err) {
  //       toast.error('Failed to update!');
  //       console.error('Error:', err);
  //     }
  //   }

  //   // Toggle edit mode
  //   updated[index].isEditable = !isCurrentlyEditable;
  //   setFormData({ ...formData, instructions: updated });
  // };


  const toggleInstructionEdit = async (index) => {
  const updated = [...formData.instructions];
  const isCurrentlyEditable = updated[index].isEditable;

  if (isCurrentlyEditable) {
    const { id: instructionId, text } = updated[index];
    const payload = { text };

    try {
      let result;

      if (instructionId) {
        // Update existing instruction
        result = await putInstructionData({ id: instructionId, form: payload }).unwrap();
        toast.success('Instruction updated!');
      } else {
        // Add new instruction
        result = await PustInstructionsData({ formattedData: payload, id }).unwrap();
        toast.success('Instruction added!');

        // Update local state with new ID from response
        if (result?.instructions?.[0]?.id) {
          updated[index].id = result.instructions[0].id;
        }
      }

      console.log('Instruction save result:', result);
    } catch (err) {
      toast.error('Failed to save instruction!');
      console.error('Save error:', err);
      return;
    }
  }

  // Toggle edit mode
  updated[index].isEditable = !isCurrentlyEditable;
  setFormData({ ...formData, instructions: updated });
};


  // Add new instruction
  const addInstruction = () => {
    const newItem = {
      id: '', // No id for new instructions until saved
      text: '',
      isEditable: true, // New instructions start in edit mode
    };
    setFormData({
      instructions: [...formData.instructions, newItem],
    });
  };

  // Delete instruction
const deleteInstruction = async (index) => {
  const updated = [...formData.instructions];
  const instructionToDelete = updated[index];

  // If instruction has an ID, delete from backend
  if (instructionToDelete.id) {
    try {
      await DeletInstructionsData(instructionToDelete.id).unwrap();
      toast.success('Instruction deleted from backend!');
    } catch (err) {
      toast.error('Failed to delete from backend!');
      console.error('Delete error:', err);
      return; // Stop here if backend deletion fails
    }
  }

  // Delete from local state
  updated.splice(index, 1);
  setFormData({ ...formData, instructions: updated });
};


  return (
    <div className="border border-gray-200 p-4 rounded-2xl mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Instructions</h2>
        <LuPlus
          onClick={addInstruction}
          className="text-[#5B21BD] cursor-pointer text-2xl"
        />
      </div>

      {formData.instructions.map((instruction, index) => (
        <div key={index} className="flex items-center gap-4 my-6 text-[#999999]">
          <p>{index + 1}.</p>
          <input
            type="text"
            value={instruction.text}
            onChange={(e) => handleInstructionChange(index, e.target.value)}
            placeholder="Mix flour, eggs, and milk together..."
            className="w-full border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
            disabled={!instruction.isEditable}
          />
          <button
            type="button"
            onClick={() => toggleInstructionEdit(index)}
            className="text-sm text-white bg-[#5B21BD] w-14 py-3 rounded-[6px] cursor-pointer"
          >
            {instruction.isEditable ? 'Save' : 'Edit'}
          </button>
          <LuTrash2
            onClick={() => deleteInstruction(index)}
            className="text-[#FF0000] cursor-pointer text-xl border rounded size-10 p-2"
          />
        </div>
      ))}
    </div>
  );
}

export default Instructions;

