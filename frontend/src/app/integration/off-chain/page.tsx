"use client"

import { useState } from "react"
import {
  boundConfigToJSON,
  gpcArtifactDownloadURL,
  gpcProve,
  revealedClaimsToJSON,
} from "@pcd/gpc"
import { POD } from "@pcd/pod"
import { Loader2 } from "lucide-react"
import { Hex } from "viem"

import { useChain } from "@/hooks/useChain"
import { signPod } from "@/services/pod"
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
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <h1 className="text-4xl font-bold">Off-chain Composibility With POD</h1>
      <p className="text-muted-foreground">
        Our protocol support off-chain composibility with POD, utilizing data
        proof to secure the data integrity.
      </p>
      <h2 className="text-3xl font-semibold">POD (Provable Object Datatype)</h2>
      <p className="text-muted-foreground">
        We support our certificate as a POD, which is a data structure that
        allows you to sign, verify, and manipulate data easily though POD SDK.
      </p>
      <h2>POD Public Key: AR0xnQCKLZyF3QxTi59venirWu/hfs50OnWdazl57yE</h2>
      <PODCard />
      <PODVerifyCard />
    </main>
  )
}

function PODCard() {
  const chain = useChain()

  const [podCertResult, setPodCertResult] = useState<any>()
  const [tokenId, setTokenId] = useState<string>("")

  const [isSigning, setIsSigning] = useState(false)
  const signPodCert = async () => {
    if (!tokenId) return
    setIsSigning(true)
    try {
      const pod = await signPod(chain.id, tokenId as Hex).then((p) =>
        POD.fromJSON(p)
      )
      setPodCertResult(JSON.stringify(pod.toJSON(), null, 0))
    } catch (e) {
      setPodCertResult(e)
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>POD Certificate Request</CardTitle>
        <CardDescription>
          You can request a POD certificate by calling POST request to
          <code>/integration/off-chain</code> with data{" "}
          <code>[chainId: number, tokenId: string]</code>
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
        <Button onClick={signPodCert} disabled={isSigning || !tokenId}>
          Get Certificate POD
          {isSigning && (
            <Loader2 className="ml-2 size-4 animate-spin" strokeWidth={2} />
          )}
        </Button>
        <div className="whitespace-pre text-wrap break-all font-mono text-sm">
          {podCertResult?.toString()}
        </div>
      </CardFooter>
    </Card>
  )
}

function PODVerifyCard() {
  const [podJson, setPodJson] = useState<string>("")
  const [result, setResult] = useState<any>()

  const verify1 = async () => {
    try {
      const pod = POD.fromJSON(JSON.parse(podJson))
      const result = pod.verifySignature()
      setResult(result)
    } catch (e) {
      setResult(e)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Verifying POD</CardTitle>
        <CardDescription>
          You can use POD SDK to verify the data fields in the certificate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <LabelS>POD JSON</LabelS>
          <Textarea
            placeholder="POD JSON"
            value={podJson}
            onChange={(e) => setPodJson(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button onClick={verify1}>Verify Certificate POD</Button>
        <div className="whitespace-pre text-wrap break-all font-mono text-sm">
          {result?.toString()}
        </div>
      </CardFooter>
    </Card>
  )
}
