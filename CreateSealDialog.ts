import { useState } from "react";
import { useCreateSeal } from "@/hooks/use-seals";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Shield, Wallet, KeyRound, User } from "lucide-react";
import { useI18n, t } from "@/lib/i18n";

export function CreateSealDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateSeal();
  const { toast } = useToast();
  const { lang } = useI18n();

  const [formData, setFormData] = useState({
    contentId: "",
    wallet: "",
    idAddress: "",
    secret: "",
    consentGiven: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      toast({
        title: t('createSeal.consentRequired', lang),
        description: t('createSeal.consentRequiredDesc', lang),
        variant: "destructive",
      });
      return;
    }

    mutate({
      contentId: formData.contentId,
      wallet: formData.wallet,
      idAddress: formData.idAddress || undefined,
      secret: Number(formData.secret),
      consentGiven: formData.consentGiven
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ contentId: "", wallet: "", idAddress: "", secret: "", consentGiven: true });
        toast({
          title: t('createSeal.sealGenerated', lang),
          description: t('createSeal.sealGeneratedDesc', lang),
        });
      },
      onError: (err) => {
        toast({
          title: t('createSeal.error', lang),
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-display font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <Plus className="w-4 h-4 mr-2" />
          {t('createSeal.newSeal', lang)}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 border-primary/20 backdrop-blur-xl sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display text-primary">
            <Shield className="w-6 h-6" />
            {t('createSeal.title', lang)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="contentId" className="font-mono text-xs uppercase text-muted-foreground flex items-center gap-2">
              <KeyRound className="w-3 h-3" />
              {t('createSeal.contentId', lang)}
            </Label>
            <Input
              id="contentId"
              value={formData.contentId}
              onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder={t('createSeal.contentIdPlaceholder', lang)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet" className="font-mono text-xs uppercase text-muted-foreground flex items-center gap-2">
              <Wallet className="w-3 h-3" />
              {t('createSeal.walletAddress', lang)}
            </Label>
            <Input
              id="wallet"
              value={formData.wallet}
              onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder={t('createSeal.walletPlaceholder', lang)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idAddress" className="font-mono text-xs uppercase text-muted-foreground flex items-center gap-2">
              <User className="w-3 h-3" />
              {t('createSeal.idAddress', lang)}
            </Label>
            <Input
              id="idAddress"
              value={formData.idAddress}
              onChange={(e) => setFormData({ ...formData, idAddress: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder={t('createSeal.idAddressPlaceholder', lang)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret" className="font-mono text-xs uppercase text-muted-foreground flex items-center gap-2">
              <Shield className="w-3 h-3" />
              {t('createSeal.zkpSecret', lang)}
            </Label>
            <Input
              id="secret"
              type="number"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder={t('createSeal.zkpSecretPlaceholder', lang)}
              required
            />
            <p className="text-[10px] text-primary/70 font-mono">{t('createSeal.zkpSecretNote', lang)}</p>
          </div>

          <div className="flex items-start space-x-3 p-4 border border-primary/10 bg-primary/5 rounded-sm">
            <Checkbox
              id="consent"
              checked={formData.consentGiven}
              onCheckedChange={(c) => setFormData({ ...formData, consentGiven: c === true })}
              className="mt-1 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('createSeal.acceptLegal', lang)}
              </label>
              <p className="text-xs text-muted-foreground">
                {t('createSeal.consentText', lang)}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full font-display font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('createSeal.generating', lang)}
                </>
              ) : (
                t('createSeal.createButton', lang)
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
