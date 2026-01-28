import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio } from "lucide-react";
import { useState } from "react";

export function RadioWidget() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            Rádio Oxigênio
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span className="text-xs text-destructive font-medium">AO VIVO</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Track */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center animate-pulse-glow">
              <Radio className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Motivational Mix #42</p>
            <p className="text-xs text-muted-foreground truncate">HimeFit Workout Playlist</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full animate-shimmer"
                  style={{ width: "65%", backgroundSize: "200% 100%" }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">2:34 / 3:45</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-gradient-primary hover:opacity-90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">{volume}%</span>
        </div>

        {/* Next Announcement */}
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-xs text-warning font-medium">Próximo anúncio em 5:32</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            "Promoção Especial: 20% off em suplementos!"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
