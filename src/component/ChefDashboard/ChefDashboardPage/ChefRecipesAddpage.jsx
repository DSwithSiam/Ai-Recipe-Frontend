import { useState } from 'react';
import { LuPlus, LuUpload } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { useGetCategoryListQuery, useRecipeCreateMutation } from '../../../Rudux/feature/ApiSlice';
import { useForm, useFieldArray } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

function ChefRecipesAddpage() {
    const [recipeCreate] = useRecipeCreateMutation();
    const { data: categoryList, isLoading, error } = useGetCategoryListQuery();

    const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            title: '',
            category: '',
            description: '',
            image: null,
            ingredients: [],
            instructions: [],
            chefNotes: [],
        },
    });

    const {
        fields: ingredients,
        append: appendIngredient,
    } = useFieldArray({ control, name: 'ingredients' });

    const {
        fields: instructions,
        append: appendInstruction,
    } = useFieldArray({ control, name: 'instructions' });

    const {
        fields: chefNotes,
        append: appendNote,
    } = useFieldArray({ control, name: 'chefNotes' });

    const imageFile = watch('image');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('image', file);
        }
    };

    const handleAddIngredient = () => {
        appendIngredient({ name: '', quantity: '', unit: '' });
    };

    const handleAddInstruction = () => {
        appendInstruction({ text: '' });
    };

    const handleAddNote = () => {
        appendNote({ text: '' });
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }

        formData.append('ingredients', JSON.stringify(data.ingredients));
        formData.append('instructions', JSON.stringify(data.instructions));
        formData.append('chef_notes', JSON.stringify(data.chefNotes));

        try {
            const response = await recipeCreate(formData).unwrap();
            toast.success('Recipe created successfully!', { position: 'top-right' });
            console.log('Recipe created successfully:', response);
            // 🔁 Reset the form here
            reset({
                title: '',
                category: '',
                description: '',
                image: null,
                ingredients: [],
                instructions: [],
                chefNotes: [],
            });
        } catch (error) {
            toast.error('Failed to create recipe. Please try again.', { position: 'top-right' });
            console.error(error);
        }
    };

    return (
        <div>
            <div className="px-12 py-6 lora">
                <h1 className="text-[34px] font-semibold text-[#5B21BD] my-2">Recipes Details View</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xl font-medium text-[#5B21BD] mb-2">Recipe Title</label>
                            <input
                                type="text"
                                {...register('title', { required: true })}
                                placeholder="Classic Chocolate Soufflé"
                                className="w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-xl font-medium text-[#5B21BD] mb-2">Category</label>
                            <select
                                {...register('category', { required: true })}
                                className="w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] text-[#999999] rounded-md"
                            >
                                {isLoading ? (
                                    <option value="">Loading...</option>
                                ) : error ? (
                                    <option value="">Error loading categories</option>
                                ) : categoryList?.data?.length > 0 ? (
                                    categoryList.data.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No categories available</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xl font-medium text-[#5B21BD] mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="A light and airy dessert with a molten center"
                                className="w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md h-24 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xl font-medium text-[#5B21BD] mb-2">Upload Image</label>
                            <div className="w-full h-24 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md flex items-center justify-center">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="Uploaded Preview" className="max-h-full max-w-full p-2 rounded-2xl object-contain" />
                                ) : (
                                    <label className="cursor-pointer relative">
                                        <LuUpload className="text-[20px] text-[#5B21BD] absolute bottom-5 left-11" />
                                        <span className="text-[#5B21BD]">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden "
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className='border border-gray-200 p-4 rounded-2xl'>
                        <div className='flex justify-between mb-2'>
                            <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Recipe Ingredients</h2>
                            <button type="button" onClick={handleAddIngredient} className="text-xl border border-[#5B21BD] text-[#5B21BD] px-2 h-10 rounded-[10px] flex items-center">
                                <LuPlus />
                            </button>
                        </div>
                        <div className="space-y-6 text-[#999999]">
                            {ingredients.map((ingredient, index) => (
                                <div key={ingredient.id} className="flex gap-6">
                                    <input
                                        type="text"
                                        {...register(`ingredients.${index}.name`, { required: true })}
                                        placeholder="Ingredient name"
                                        className="w-[40%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
                                    />
                                    <input
                                        type="text"
                                        {...register(`ingredients.${index}.quantity`, { required: true })}
                                        placeholder="Quantity"
                                        className="w-[20%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] text-center py-3 px-3"
                                    />
                                    <input
                                        type="text"
                                        {...register(`ingredients.${index}.unit`, { required: true })}
                                        placeholder="Unit (e.g., grams, cups)"
                                        className="w-[40%] border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] py-3 px-3"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className='border border-gray-200 p-4 rounded-2xl'>
                        <div className='flex justify-between mb-2'>
                            <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Instructions</h2>
                            <button type="button" onClick={handleAddInstruction} className="text-xl border border-[#5B21BD] text-[#5B21BD] px-2 h-10 rounded-[10px] flex items-center">
                                <LuPlus />
                            </button>
                        </div>
                        <div className="space-y-6 text-[#999999]">
                            {instructions.map((instruction, index) => (
                                <div key={instruction.id} className="flex gap-6">
                                    <textarea
                                        {...register(`instructions.${index}.text`, { required: true })}
                                        placeholder="Enter instruction"
                                        className="w-full border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] pl-2 pt-2 resize-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chef Notes Section */}
                    <div className='border border-gray-200 p-4 rounded-2xl'>
                        <div className='flex justify-between mb-2'>
                            <h2 className="text-xl font-semibold text-[#5B21BD] py-4">Chef's Note</h2>
                            <button type="button" onClick={handleAddNote} className="text-xl border border-[#5B21BD] text-[#5B21BD] px-2 h-10 rounded-[10px] flex items-center">
                                <LuPlus />
                            </button>
                        </div>
                        <div className="space-y-6 text-[#999999]">
                            {chefNotes.map((note, index) => (
                                <div key={note.id} className="flex gap-6">
                                    <textarea
                                        {...register(`chefNotes.${index}.text`)}
                                        placeholder="Enter chef's note"
                                        className="w-full border bg-[#FFFFFF] border-[#CCBAEB] rounded-[10px] pl-2 pt-2 resize-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-x-4 mt-10">
                        <button type="submit" className="text-xl text-white bg-[#5B21BD] py-2 px-5 rounded-[10px] cursor-pointer">
                            Submit
                        </button>
                        <Link to="/chef_dashboard/ai_training" className="text-xl text-white bg-[#5B21BD] py-2 px-5 rounded-[10px] cursor-pointer">
                            Next
                        </Link>
                    </div>
                </form>
            </div>
            <Toaster position='top-right' />
        </div>
    );
}

export default ChefRecipesAddpage;


