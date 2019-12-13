import React, {useEffect, useState} from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline ,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
};

export default function CustomTable(props) {

    const [state, setState] = useState(
        {
            title: props.title,
            columns: props.colums,
            data: props.data,
            actions: props.actions
        }
    );

    useEffect(() => {
        setState({
            ...state,
            data: props.data,
        })
    }, [JSON.stringify(props.data)]);

    return (
        <MaterialTable
            //more custom info at https://material-table.com/#/docs/features/localization
            localization={{
                pagination: {
                    firstTooltip: "First Page (add tsv)",
                    previousTooltip: "Previous Page (add tsv)",
                    nextTooltip: "Next Page (add tsv)",
                    lastTooltip: "Last Page (add tsv)",
                    labelRowsSelect: " (add tsv)",
                    labelDisplayedRows: '{from}-{to} of {count} (add tsv)'
                },
                toolbar: {
                    nRowsSelected: '{0} row(s) selected (add tsv)',
                    searchPlaceholder: "Search (add tsv)"
                },
                header: {
                    actions: 'Actions (add tsv)'
                },
                body: {
                    emptyDataSourceMessage: 'No records to display (add tsv)',
                    filterRow: {
                        filterTooltip: 'Filter (add tsv)'
                    }
                }
            }}
            icons={tableIcons}
            title={state.title}
            columns={state.columns}
            data={state.data}
            actions={state.actions}
            options={{
                search: true
            }}
        />
    );
}