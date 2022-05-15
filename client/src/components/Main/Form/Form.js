import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { QUERY_THOUGHTS, QUERY_ME } from '../../../utils/queries';
import { ADD_THOUGHT, ADD_REACTION } from '../../../utils/mutations';

const Form = props => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const  thoughtId  = props?.thoughtId || false;
    // const [addReaction, { reactionError }] = useMutation(ADD_REACTION);
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {

            // could potentially not exist yet, so wrap in a try/catch
            try {
                // update me array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
                });
            } catch (e) {
                console.warn("First thought insertion by user!")
            }

            // update thought array's cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] },
            });
        }
    });

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setTextAreaValue(event.target.value);
            setCharacterCount(event.target.value.length);
        }
        console.log('-->', textAreaValue);

    };

    const handleFormSubmit = async event => {
        event.preventDefault();
        console.log('Form submit:');


        if (!thoughtId) {
            console.log('!***^^^^^^^^addThought^^^^^***!');
            try {
                // add thought to database
                await addThought({
                    variables: { textAreaValue }
                });

                // clear form value
                setTextAreaValue('');
                setCharacterCount(0);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log('------- addReaction')
            console.log(thoughtId);

            try {
                // add thought to database
                // await addReaction({
                //     variables: { thoughtId, textAreaValue }
                // });

                // clear form value
                setTextAreaValue('');
                setCharacterCount(0);
            } catch (e) {
                console.error(e);
            }

        }


    };

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {/* {error && <span className="ml-2">Something went wrong...</span>} */}
            </p>
            <form
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder={`Here's a new ${props.type}...`}
                    value={textAreaValue}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}>
                </textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Form;