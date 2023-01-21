import React, { useState } from "react";
import { RecordSummaryData } from "../types";
import { useAppSelector } from "../../../../redux/hooks";
import { downloadPdf } from "../../../../redux/search/actions";
import history from "../../../../service/history";
import ChargesList from "./ChargesList";
import CountyFines from "./CountyFines";
import { IconButton } from "../../../common/IconButton";

interface Props {
  summary: RecordSummaryData;
}

export default function RecordSummary({ summary }: Props) {
  const loadingPdf = useAppSelector((state) => state.search.loadingPdf);
  const [canGenerateForms, setCanGenerateForms] = useState(true);
  const {
    total_cases,
    total_charges,
    charges_grouped_by_eligibility_and_case: groupedCharges,
    ...fines
  } = summary;

  const handleGenerateFormsClick = () => {
    if (groupedCharges["Eligible Now"]?.length > 0) {
      history.push("/fill-expungement-forms");
    } else {
      setCanGenerateForms(false);
    }
  };

  return (
    <div className="bg-white shadow br3 mb3 ph3 pb3">
      <div className="flex flex-wrap justify-end mb1">
        <h2 className="f5 fw7 mv3 mr-auto">Search Summary</h2>

        {!canGenerateForms && (
          <span className="bg-washed-red mv2 pa2 br3 fw6" role="alert">
            There must be eligible charges to generate paperwork.{" "}
            <IconButton
              iconClassName="fa-time-circle gray"
              hiddenText="Close"
              onClick={() => {
                setCanGenerateForms(true);
              }}
            />
          </span>
        )}

        <IconButton
          iconClassName="fa-bolt pr2"
          displayText="Generate Paperwork"
          onClick={handleGenerateFormsClick}
        />

        <IconButton
          buttonClassName={loadingPdf ? "loading-btn" : ""}
          iconClassName="fa-download pr2"
          displayText="Summary PDF"
          onClick={() => {
            downloadPdf();
          }}
        />
      </div>

      <div className="flex-ns flex-wrap">
        <ChargesList
          eligibleChargesByDate={groupedCharges}
          totalCases={total_cases}
          totalCharges={total_charges}
        />
        <div className="w-100 w-33-l ph3-l mb3">
          <CountyFines {...fines} />
        </div>
      </div>
    </div>
  );
}
