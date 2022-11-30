import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as setSelectionIndentation from '../../../lib/modelApi/block/setSelectionIndentation';
import setIndentation from '../../../lib/publicApi/block/setIndentation';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('setIndentation', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IExperimentalContentModelEditor;

    beforeEach(() => {
        editor = ({
            createContentModel: () => fakeModel,
        } as any) as IExperimentalContentModelEditor;
    });

    it('indent', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(setSelectionIndentation, 'setSelectionIndentation');

        setIndentation(editor, 'indent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(setSelectionIndentation.setSelectionIndentation).toHaveBeenCalledTimes(1);
        expect(setSelectionIndentation.setSelectionIndentation).toHaveBeenCalledWith(
            fakeModel,
            'indent',
            undefined
        );
    });

    it('outdent', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(setSelectionIndentation, 'setSelectionIndentation');

        setIndentation(editor, 'outdent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(setSelectionIndentation.setSelectionIndentation).toHaveBeenCalledTimes(1);
        expect(setSelectionIndentation.setSelectionIndentation).toHaveBeenCalledWith(
            fakeModel,
            'outdent',
            undefined
        );
    });
});
