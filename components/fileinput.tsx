"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { arrayToObjects } from "@/lib/utils";
import { Spinner } from "@/components/spinner";

export default function XLSXFileInput({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<any>;
}) {
  const [file, setFile] = useState(null);
  const [dataInfo, setDataInfo] = useState<{
    numRows?: number;
    numCols?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .xlsx file");
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      //   const numRows = jsonData.length;
      //   const numCols = jsonData[0] ? jsonData[0].length : 0;

      const objects = arrayToObjects(jsonData);

      try {
        setLoading(true);
        const created = await onSubmit(objects);
        setLoading(false);

        setDataInfo({ numRows: created.length });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md max-w-md mx-auto text-center">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input
              id="picture"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
            />
          </div>

          <Button onClick={handleSubmit}>Submit</Button>
          {dataInfo && (
            <div>
              <p>Dados inseridos com sucesso: {dataInfo.numRows}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
