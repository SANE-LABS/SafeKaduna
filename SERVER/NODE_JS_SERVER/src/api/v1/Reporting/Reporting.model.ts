import { Schema, model } from "mongoose";

interface LocationProps {
	latitude: number;
	longitude: number;
}

const Location = new Schema<LocationProps>({
	latitude: Number,
	longitude: Number,
});
//ensure this looks like the dataset
const reportingSchema = new Schema({
	category: String,
	images: [String],
	location: Location,
	information: String,

});

const Reporting = model("Reporting", reportingSchema);

export default Reporting;
