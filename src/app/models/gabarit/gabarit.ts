/**
 * @author Emeric Chauret
 */

import {Section} from '../section/section';

export interface Gabarit {
    id: number,
    nom: string,
    sections: Section[]
}
