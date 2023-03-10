/* eslint-disable no-useless-escape */
import {
	AddressInputs,
	InputContainer,
	Title,
	UserAddressContainer,
} from "./style";
import { useFormContext, Controller } from "react-hook-form";
import { MapPinLine } from "phosphor-react";

import axios, { AxiosResponse } from "axios";

import * as tokens from "../../../../styles/tokens/variables";
import { UserInformationType } from "../../../../entities/userInformation/schema";

const applyMaskIntoCepField = (rawValue: string) => {
	const cepMask = /^(\d{5})(\d{3})$/; // Regular expression for CEP format

	if (cepMask.test(rawValue)) {
		return rawValue.replace(cepMask, "$1-$2"); // Apply the mask to the input value
	}

	return rawValue;
};

interface IAddressData {
  bairro: string;
  localidade: string;
  logradouro: string;
  uf: string;
	erro?: boolean
}

export function UserAddress() {
	const { register, control, watch, setValue, setFocus } = useFormContext<UserInformationType>();

	const cepWatch = watch("cep");

	const setFields = (addressData: IAddressData) => {
		setValue("street", addressData.logradouro);
		setValue("district", addressData.bairro);
		setValue("city", addressData.localidade);
		setValue("state", addressData.uf);
	};

	const fetchAddressData = async (rawCep: string) => {
		try {
			const response: AxiosResponse<IAddressData> = await axios.get(
				`https://viacep.com.br/ws/${rawCep}/json/`
			);
			const addressData = response.data;
		
			if(!addressData.erro) setFocus("number");
				
			setFields(addressData);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return (
		<UserAddressContainer>
			<Title>
				<MapPinLine size={22} color={tokens.SdBrandYellowDark} />
				<div>
					<h3>Endereço de Entrega</h3>
					<h4>Informe o endereço onde deseja receber seu pedido</h4>
				</div>
			</Title>

			<AddressInputs>
				<InputContainer>
					<Controller
						control={control}
						name="cep"
						render={({ field: { onChange, value } }) => (
							<input
								tabIndex={0}
								style={{ maxWidth: "min(200px, 100%)" }}
								value={value}
								onChange={(event) => {
									const rawCep = event.target.value.replace(/\D/g, "");

									if(rawCep.length > 8) return;

									if(cepWatch?.length === 9 && rawCep.length < 8) {
										setFields({
											bairro: "",
											localidade: "",
											logradouro: "",
											uf: "",
										});
										setValue("number", 0);
										setValue("complement","");

									}

									const inputWithMask = applyMaskIntoCepField(rawCep);
									
									if (rawCep.length === 8 && rawCep !== cepWatch?.replace("-", "")) fetchAddressData(rawCep);

									onChange(inputWithMask);
								}}
								type="text"
								placeholder="CEP"
							/>
						)}
					/>
				</InputContainer>

				<InputContainer>
					<input {...register("street")} type="text" placeholder="Rua" required/>
				</InputContainer>

				<InputContainer>
					<input
						style={{ maxWidth: "min(200px, 100%)" }}
						{...register("number", { valueAsNumber: true })}
						min={1}
						type="number"
						placeholder="Número"
						required
					/>
					<input
						id="complement"
						{...register("complement")}
						type="text"
						placeholder="Complemento"
					/>
				</InputContainer>

				<InputContainer>
					<input
						style={{ maxWidth: "min(200px, 100%)" }}
						{...register("district")}
						type="text"
						placeholder="Bairro"
						required
					/>
					<input
						style={{ maxWidth: "min(276px, 100%)" }}
						{...register("city")}
						type="text"
						placeholder="Cidade"
						required
					/>
					<input
						style={{ maxWidth: "min(60px, 100%)" }}
						{...register("state")}
						type="text"
						placeholder="UF"
						required
					/>
				</InputContainer>
			</AddressInputs>
		</UserAddressContainer>
	);
}
