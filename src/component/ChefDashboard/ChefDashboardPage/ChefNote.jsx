



import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { useDeletChefNoteDataMutation, useGetChefNoteDataQuery, usePustChefNoteDataMutation, usePutChefNoteDataMutation } from '../../../Rudux/feature/ApiSlice';

function ChefNote() {
  const { id } = useParams(); // Recipe ID from URL
  const { data: chefNoteData } = useGetChefNoteDataQuery(id);
  const [putChefNoteData] = usePutChefNoteDataMutation();
  const [PustChefNoteData] = usePustChefNoteDataMutation();
  const [DeletChefNoteData] = useDeletChefNoteDataMutation();

  const [formData, setFormData] = useState({
    chef_notes: [],
  });

  // Load backend data into form
  useEffect(() => {
    console.log('chefNoteData:', chefNoteData); // Debug incoming data
    const incoming = chefNoteData?.chef_notes || chefNoteData?.data;
    if (Array.isArray(incoming)) {
      const formatted = incoming.map((item) => {
        console.log('item id:', item.id); // Log each item's id
        return {
          id: item.id || '', // Ensure id is included, empty string for new notes
          text: item.text || '',
          isEditable: false, // Default to non-editable
        };
      });
      setFormData({ chef_notes: formatted });
    }
  }, [chefNoteData]);

  // Handle note change
  const handleChefNoteChange = (index, value) => {
    const updated = [...formData.chef_notes];
    updated[index].text = value;
    setFormData({ ...formData, chef_notes: updated });
  };

 
const toggleChefNoteEdit = async (index) => {
  const updated = [...formData.chef_notes];
  const isCurrentlyEditable = updated[index].isEditable;

  if (isCurrentlyEditable) {
    const { id: noteId, text } = updated[index];
    const payload = { text };

    try {
      let result;

      if (noteId) {
        // Update existing note
        result = await putChefNoteData({ id: noteId, form: payload }).unwrap();
        toast.success('Chef note updated!');
      } else {
        // Create new note
        result = await PustChefNoteData({ formattedData: payload, id }).unwrap();
        toast.success('Chef note added!');

        // Set new ID from response
        if (result?.chef_notes?.[0]?.id) {
          updated[index].id = result.chef_notes[0].id;
        }
      }

      console.log('Chef note save result:', result);
    } catch (err) {
      toast.error('Failed to save note!');
      console.error('Save error:', err);
      return;
    }
  }

  // Toggle edit mode
  updated[index].isEditable = !isCurrentlyEditable;
  setFormData({ ...formData, chef_notes: updated });
};

  // Add new note
  const addChefNote = () => {
    const newNote = {
      id: '', // No id for new notes until saved
      text: '',
      isEditable: true, // New notes start in edit mode
    };
    setFormData({
      chef_notes: [...formData.chef_notes, newNote],
    });
  };

  // Delete note
const deleteChefNote = async (index) => {
  const noteToDelete = formData.chef_notes[index];

  // If the note has an ID, delete from backend
  if (noteToDelete.id) {
    try {
      await DeletChefNoteData(noteToDelete.id).unwrap();
      toast.success('Chef note deleted from server!');
    } catch (err) {
      toast.error('Failed to delete from server!');
      console.error('Delete error:', err);
      return;
    }
  } else {
    toast.success('Unsaved note removed!');
  }

  // Remove from local state
  const updated = [...formData.chef_notes];
  updated.splice(index, 1);
  setFormData({ ...formData, chef_notes: updated });
};


  return (
    <div className="border border-gray-200 p-4 rounded-2xl mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Chef's Note</h2>
        <LuPlus
          onClick={addChefNote}
          className="text-[#5B21BD] cursor-pointer text-2xl"
        />
      </div>

      {formData.chef_notes.map((note, index) => (
        <div key={index} className="flex items-center gap-4 my-6 text-[#999999]">
          <p>{index + 1}.</p>
          <input
            type="text"
            value={note.text}
            onChange={(e) => handleChefNoteChange(index, e.target.value)}
            placeholder="Use fresh eggs for better rise..."
            className="w-full border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
            disabled={!note.isEditable}
          />
          <button
            type="button"
            onClick={() => toggleChefNoteEdit(index)}
            className="text-sm text-white bg-[#5B21BD] w-14 py-3 rounded-[6px] cursor-pointer"
          >
            {note.isEditable ? 'Save' : 'Edit'}
          </button>
          <LuTrash2
            onClick={() => deleteChefNote(index)}
            className="text-[#FF0000] cursor-pointer text-xl border rounded size-10 p-2"
          />
        </div>
      ))}
    </div>
  );
}

export default ChefNote;
