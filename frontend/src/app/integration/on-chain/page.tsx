"use client"

import { useState } from "react"
import Link from "next/link"
import { Address, fromHex } from "viem"
import { readContract } from "viem/actions"
import { useAccount, useClient } from "wagmi"

import { Course } from "@/types/course"
import { CERTIFICATE_ABI, getCertificateId } from "@/lib/certificate"
import { useAllCourses } from "@/hooks/useAllCourses"
import { useChain } from "@/hooks/useChain"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LabelS } from "@/components/ui/label"
import { DropDown } from "@/components/dropdown"
import { Markdown } from "@/components/markdown"

export default function Page() {
  const chain = useChain()
  const courses = useAllCourses()

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <h1 className="text-4xl font-bold">
        On-chain Integration & Composibility
      </h1>
      <p className="text-muted-foreground">
        Integrate our on-chain course ownership and certificates with your
        application.
      </p>

      <h2>
        Our {chain.name} Contract Address:{" "}
        <Link
          className="font-mono"
          href={`${chain.blockExplorers?.default.url}/address/${chain.certificate}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {chain.certificate}
        </Link>
      </h2>

      {courses.data && <TokenIdBlock courses={courses.data} />}
      {courses.data && <GetCertificateBlock />}

      <h2 className="text-3xl font-semibold">Example Contract</h2>
      <h3 className="text-2xl font-medium">DeFi Protocol Certificate Gated</h3>
      <p className="text-muted-foreground">
        {
          "Let's say you have a very advanced DeFi protocol, you might want your users to have prior knowledge of the protocol, finance, and DeFi before they can interact with your protocol. You can use our certificate system to gate access to your protocol."
        }
      </p>
      <Markdown>
        {`

\`\`\` solidity
// constructor with certificate contract address
constructor(address _certificateContract) {
    certificateContract = ICertificateValidator(_certificateContract);
}

// apply certificate modifier
modifier onlyCertified(string memory certificateId) {
    (
        bool exists,
        ICertificateValidator.Status status,
        uint256 expiryTimestamp
    ) = certificateContract.checkCertificateStatus(
            msg.sender,
            certificateId
        );

    require(exists, "Certificate not found");
    require(
        status == ICertificateValidator.Status.Active,
        "Certificate not active"
    );
    require(block.timestamp <= expiryTimestamp, "Certificate expired");
    _;
}

// Basic trading functions require basic certification
function placeTrade(
    uint256 amount
) external onlyCertified(BASIC_TRADER_CERT) {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    // Trading logic
}

// Advanced operations require advanced certification
function placeComplexTrade(
    uint256 amount,
    bytes calldata data
) external onlyCertified(ADVANCED_TRADER_CERT) {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    // Complex trading logic
}
\`\`\`
`}
      </Markdown>
    </main>
  )
}

function TokenIdBlock({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const [selectedCourseExt, setSelectedCourseExt] = useState("")
  const [result, setResult] = useState<Error | Address | undefined>()

  const account = useAccount()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Certificate Token Id</CardTitle>
        <CardDescription>
          Calculate certificate token id by keccak256(address,
          course_identifier)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <LabelS>Address</LabelS>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Address"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!account.address}
              onClick={() => setSelectedAddress(account.address!)}
            >
              Use Your Address
            </Button>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <div>
            <LabelS>Course ID</LabelS>
            <DropDown
              items={courses.map((course) => ({
                label: course.title,
                value: course.id,
              }))}
              value={selectedCourse}
              setValue={setSelectedCourse}
              selectLabel="Select Course"
            />
          </div>
          <div>
            <LabelS>Course Ext</LabelS>
            <DropDown
              items={[
                {
                  label: "Course Access",
                  value: ".",
                },
                {
                  label: "Course Exam Pass",
                  value: "-exam",
                },
                {
                  label: "Course Certificate",
                  value: "-certificate",
                },
              ]}
              value={selectedCourseExt}
              setValue={setSelectedCourseExt}
              selectLabel="Select Course Ext"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          onClick={() => {
            try {
              const id = getCertificateId(
                selectedAddress as Address,
                `${selectedCourse}${selectedCourseExt === "." ? "" : selectedCourseExt}`
              )
              setResult(id)
            } catch (e: any) {
              setResult(e)
            }
          }}
        >
          Calculate
        </Button>
        {result && (
          <div className="whitespace-pre text-wrap break-all font-mono text-sm">
            {result?.toString()}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function GetCertificateBlock() {
  const [tokenId, setTokenId] = useState("")
  const [result, setResult] = useState<Error | any>()
  const chain = useChain()
  const client = useClient() as any

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Certificate Info</CardTitle>
        <CardDescription>
          Get certificate info by tokenId from the contract, call{" "}
          <code>
            getCertificateInfo(uint256 tokenId) -{">"} (string memory
            certificateId, uint256 issueTimestamp, uint256 expiryTimestamp,
            Status status, Level level)
          </code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <LabelS>Token ID</LabelS>
          <Input
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          onClick={async () => {
            try {
              const result = await readContract(client, {
                abi: CERTIFICATE_ABI,
                address: chain.certificate,
                functionName: "getCertificateInfo",
                args: [fromHex(tokenId as Address, "bigint")],
              })
              setResult(result)
            } catch (e) {
              setResult(e)
            }
          }}
        >
          Get Certificate Info
        </Button>
        <div className="whitespace-pre text-wrap break-all font-mono text-sm">
          {result?.toString()}
        </div>
      </CardFooter>
    </Card>
  )
}
