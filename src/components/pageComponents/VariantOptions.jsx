import { TagInput } from 'rsuite'
import Info from '../elements/Info'
import Asterisk from '../elements/Asterisk'
import { useEffect, useState } from 'react'
import { validateVariantOptionForm } from '../../utils/validationHelper';


export default function VariantOptions({ closeVariantModal, id, setId, options, setOptions }) {
    const [type, setType] = useState("");
    const [tags, setTags] = useState([]);
    const [variantOptionFormErrors, setVariantOptionFormErrors] = useState({});

    
    // REMOVE VARIANT OPTION VALUE
    const handleOnTagRemove = function(tag) {
        const modified = tags?.filter(el => el !== tag);
        setTags([...modified]);
    }

    // EDIT OR SAVE VARIANT OPTION
    const handleSaveVariant = function() {
        const newErrors = validateVariantOptionForm({type, values: tags});
        setVariantOptionFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        //////////////////////////////////////////
        if (id) {
            // Editing an existing option
            setOptions(prev => prev.map(option => option.id == id ? { ...option, type, values: tags } : option));
        } else {
            const existingOption = options.find(option => option.type == type);

            if (existingOption) {
                // Merging values with an existing option
                setOptions(prev => prev.map(option => option.type === type ? { ...option, values: [...new Set([...option.values, ...tags])] } : option));
            } else {
                // Creating a new option
                const newOption = {
                    id: Math.floor(Math.random() * 9000) + 1000,
                    type, values: tags
                };

                setOptions(prev => [...prev, newOption]);
            }
        }

        setId("");
        closeVariantModal();
    };

    // IN CASE OF EDITING...
    useEffect(function() {
        if(id) {
            const editingOption = options.find(option => option.id == id);
            setType(editingOption?.type || "")
            setTags(editingOption?.values || [])
        }
    }, [id])



    return (
        <div className="form--variation">
            <h3 className='modal--heading' style={{ marginBottom: "1rem", fontWeight: "600" }}>Add Variation Options</h3>

            <div className="form--item">
                <label className="form--label">Variation Type <Asterisk /></label>
                <input type="text" className="form--input" placeholder='Variation Type, Like: color, size, etc' value={type} onChange={(e) => setType(e.target.value)} />
                <span className="form--error-message">
                    {(!type && variantOptionFormErrors.type) && variantOptionFormErrors.type}
                </span>
            </div>

            <div className="form--item">
                <label className="form--label">Variation Value(s) <Asterisk /></label>
                <TagInput
                    className='form--input'
                    placeholder="Variation Value, Like: Red, XL, Big, etc"
                    trigger={['Enter', 'Space']}
                    size="md"
                    value={tags}
                    onClean={() => setTags([])}
                    onChange={(tag) => setTags(tag)}
                    onTagRemove={handleOnTagRemove}
                />
                <span className="form--error-message">
                    {tags.length < 1 && variantOptionFormErrors.values && variantOptionFormErrors.values}
                </span>

                <Info text='Enter multiple values of the same "Variation" type, (press "SPACE" key after typing a value)' />
            </div>

            <div className="page__section--actions" style={{ margin: "1.4rem 0 0 auto" }}>
                <button className='button clear--button' onClick={() => {
                    setId("");
                    closeVariantModal();
                }}>Cancel</button>
                <button className="button submit--button" onClick={handleSaveVariant}>Save</button>
            </div>
        </div>
    );
}
