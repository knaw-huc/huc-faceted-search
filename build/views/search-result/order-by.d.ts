import * as React from 'react';
interface Props {
    fields: AppProps['fields'];
    setSortOrder: SetSortOrder;
    sortOrder: SortOrder;
}
declare function OrderBy(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof OrderBy>;
export default _default;
