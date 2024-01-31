import { contractAddresses, eNrsEngine, abi, perp, eNrs, fundMe } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"

export default function Engine() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const [tokenCollateralAddress, setTokenCollateralAddress] = useState("")
    const [amountCollateral, setAmountCollateral] = useState("")
    const [amounteNRStoMint, setAmounteNRStoMint] = useState("")
    const [amounteNRStoBurn, setAmounteNRStoBurn] = useState("")
    const [amount, setAmount] = useState("")
    const chainId = parseInt(chainIdHex)
    const eNrsEngineAddress = contractAddresses["eNrsEngine"][0]
    const eNrsAddress = contractAddresses["eNrs"][0]
    const perpAdress = contractAddresses["perp"][0]

    const [collateralTokens, setCollateralTokens] = useState("0")

    const dispatch = useNotification()
    const { runContractFunction: depositCollateralAndMinteNRS } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress,
        functionName: "depositCollateralAndMinteNRS",
        params: {
            tokenCollateralAddress: tokenCollateralAddress,
            amountCollateral: amountCollateral,
            amounteNRStoMint: amounteNRStoMint,
        },
    })

    const { runContractFunction: redeemCollateralForeNRS } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress,
        functionName: "redeemCollateralForeNRS",
        params: {
            tokenCollateralAddress: tokenCollateralAddress,
            amountCollateral: amountCollateral,
            amounteNRStoBurn: amounteNRStoBurn,
        },
    })

    const { runContractFunction: liquidate } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress,
        functionName: "liquidate",
        params: {
            collateralAddress: tokenCollateralAddress,
            user: account,
            debtToCover: amountCollateral,
        },
    })

    const { runContractFunction: getAccountCollateralValue } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress, // specify the networkId
        functionName: "getAccountCollateralValue",
        params: {
            user: account,
        },
    })

    const { runContractFunction: getCollateralBalance } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress, // specify the networkId
        functionName: "getCollateralBalance",
        params: {
            user: account,
            token: tokenCollateralAddress,
        },
    })

    const { runContractFunction: getNRSValue } = useWeb3Contract({
        abi: eNrsEngine,
        contractAddress: eNrsEngineAddress, // specify the networkId
        functionName: "getNRSValue",
        params: {
            token: tokenCollateralAddress,
            amount: amount,
        },
    })

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeposit = async (e) => {
        e.preventDefault()
        await depositCollateralAndMinteNRS({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    const handleRedeem = async (e) => {
        e.preventDefault()
        await redeemCollateralForeNRS({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    const handleLiquidate = async (e) => {
        e.preventDefault()
        await liquidate({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    const [accountCollateralValue, setAccountCollateralValue] = useState("")

    const handleGetAccountCollateralValue = async () => {
        try {
            const value = (await getAccountCollateralValue()).toString()
            setAccountCollateralValue(value)
        } catch (error) {
            console.error("Error fetching account collateral value:", error)
        }
    }

    const [collateralBalance, setCollateralBalance] = useState("")

    const handleGetCollateralBalance = async (e) => {
        e.preventDefault()
        try {
            const balance = (
                await getCollateralBalance({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                })
            ).toString()
            setCollateralBalance(balance)
        } catch (error) {
            console.error("Error fetching collateral balance", error)
        }
    }

    const [nrsValue, setNrsValue] = useState("")
    const handleGetNRSValue = async (e) => {
        e.preventDefault()
        try {
            const NRSValue = (await getNRSValue()).toString()
            setNrsValue(nrsValue)
        } catch (error) {
            console.error("Error fetching NRS Value", error)
        }
    }

    return (
        <div className=" max-w-4xl p-5 flex flex-col justify-center items-center">
            <p className="text-blue font-bold text-3xl text-center  w-1/2">
                he;;p {collateralTokens}
            </p>
            <form className="max-w-sm mx-auto mt-8" onSubmit={handleDeposit}>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Token Collateral Address"
                        onChange={(e) => setTokenCollateralAddress(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="number"
                        placeholder="Amount Collateral"
                        onChange={(e) => setAmountCollateral(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="number"
                        placeholder="Amount eNRS to Mint"
                        onChange={(e) => setAmounteNRStoMint(e.target.value)}
                    />
                </div>
                <button
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    type="submit"
                >
                    Deposit Collateral and Mint eNRS
                </button>
            </form>
            <form className="max-w-sm mx-auto mt-8" onSubmit={handleRedeem}>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Token Collateral Address"
                        onChange={(e) => setTokenCollateralAddress(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="number"
                        placeholder="Amount Collateral"
                        onChange={(e) => setAmountCollateral(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="number"
                        placeholder="Amount eNRS to Burn"
                        onChange={(e) => setAmounteNRStoBurn(e.target.value)}
                    />
                </div>
                <button
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    type="submit"
                >
                    Redeem Collateral For eNRS
                </button>
            </form>
            <form className="max-w-sm mx-auto mt-8" onSubmit={handleLiquidate}>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Token Collateral Address"
                        onChange={(e) => setTokenCollateralAddress(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="number"
                        placeholder="Debt to cover"
                        onChange={(e) => setAmountCollateral(e.target.value)}
                    />
                </div>
                <button
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    type="submit"
                >
                    Liquidate
                </button>
            </form>
            <div className="max-w-sm mx-auto mt-8">
                <button
                    className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
                    onClick={handleGetAccountCollateralValue}
                >
                    Get Account Collateral Value
                </button>

                {accountCollateralValue && (
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Account Collateral Value:</p>
                        <p className="text-gray-800">{accountCollateralValue}</p>
                    </div>
                )}
            </div>

            <form className="max-w-sm mx-auto mt-8" onSubmit={{ handleGetCollateralBalance }}>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Token Collateral Address"
                        onChange={(e) => setTokenCollateralAddress(e.target.value)}
                    />
                </div>
                <button className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800">
                    Get Collateral Balance
                </button>

                {collateralBalance && (
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Collateral Balance:</p>
                        <p className="text-gray-800">{collateralTokens}</p>
                    </div>
                )}
            </form>

            <form className="max-w-sm mx-auto mt-8" onSubmit={{ handleGetNRSValue }}>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Token Collateral Address"
                        onChange={(e) => setTokenCollateralAddress(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-md"
                        type="text"
                        placeholder="Amount"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <button className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800">
                    Get NRS value
                </button>

                {nrsValue && (
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Collateral Balance:</p>
                        <p className="text-gray-800">{nrsValue}</p>
                    </div>
                )}
            </form>
        </div>
    )
}
