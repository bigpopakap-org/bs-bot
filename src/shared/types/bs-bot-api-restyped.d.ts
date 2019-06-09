import {VocabName} from "../vocab";

export default interface BsBotApi {
    /* ************************************************************************
                             RANDOMLY GENERATE B.S.
     ************************************************************************ */
    "/bs": {
        GET: {
            query: {
                vocabName: VocabName
            };
            response: {
                bs: string
            };
        };
    },

    /* ************************************************************************
                             SEE WHAT VOCABS ARE AVAILABLE
     ************************************************************************ */
    "/vocabName": {
        GET: {
            response: {
                vocabNames: Array<VocabName>
            }
        }
    }
}
