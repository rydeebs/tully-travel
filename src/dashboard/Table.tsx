import type { ReactNode } from "react";

export type TableColumn<Row extends Record<string, unknown>> = {
  align?: "left" | "right";
  header: ReactNode;
  key: keyof Row & string;
  render?: (row: Row) => ReactNode;
  width?: string;
};

type TableProps<Row extends Record<string, unknown>> = {
  columns: Array<TableColumn<Row>>;
  dense?: boolean;
  keyField: keyof Row & string;
  rows: Row[];
};

type StatusTagProps = {
  children: ReactNode;
  tone: "ink" | "gold" | "muted";
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function cellValue<Row extends Record<string, unknown>>(column: TableColumn<Row>, row: Row) {
  if (column.render) {
    return column.render(row);
  }

  const value = row[column.key];
  return value === null || value === undefined ? "" : String(value);
}

export function Table<Row extends Record<string, unknown>>({
  columns,
  dense = false,
  keyField,
  rows,
}: TableProps<Row>) {
  return (
    <div className="app-dash-table-wrap">
      <table className={cx("app-dash-table", dense && "app-dash-table--dense")}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={cx(column.align === "right" && "app-dash-table__cell--right")}
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[keyField])}>
              {columns.map((column) => (
                <td
                  className={cx(column.align === "right" && "app-dash-table__cell--right")}
                  key={column.key}
                >
                  {cellValue(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusTag({ children, tone }: StatusTagProps) {
  return <span className={cx("app-dash-status-tag", `app-dash-status-tag--${tone}`)}>{children}</span>;
}
