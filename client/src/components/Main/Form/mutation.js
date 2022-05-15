import { ADD_THOUGHT, ADD_REACTION } from '../../../utils/mutations';
import { useMutation } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME } from '../../../utils/queries';

const Mutate = async (textareaValue, thoughtId) => {
    // const { textareaValue } = props;
    // const thoughtId = props?.variables || '';

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

    const [addReaction, { reactionError }] = useMutation(ADD_REACTION);


    if (!thoughtId) {
        console.log('!***^^^^^^^^addThought^^^^^***!')

        await addThought({
            variables: { textareaValue }
        });
    } else {
        console.log('!***^^^^^^88888 addReaction 888888^^^^^^^***!')

        await addReaction({
            variables: { thoughtId, textareaValue }
        });
    }
}


export default Mutate;