# Text Summerizer

## Setup

### 1. Launch Dev Container

Launch Dev Container with [VSCode Dev Container Extension](https://code.visualstudio.com/docs/devcontainers/containers) or [GitHub Codespaces](https://github.com/features/codespaces).

### 2. Create .env file

Copy `.env.example` as `.env`

```
cp .env.example .env
```

1. Set `OPENAI_API_KEY` .
   You can find it in https://platform.openai.com/account/api-keys
2. Set `FILE_PATH`. This is the path of the file to be summarized.

## Usage

1. Copy text to be summarized to the file specified in .env
2. Run `yarn run start`

## Example

### Input

Input (content of `/workspaces/long-text-summarizer/text.txt` that is specified in `.env`) is

<details>
<summary>Input Text</summary>

```
The history of the temple presents, however, several questions, some of which seem still undecided. When was the temple built? Was it all built at one time? Was it restored after its destruction by the Persians? Did it continue in use after the erection of the Parthenon? Was it in existence in the days of Pausanias? Did Pausanias mention it in his description of the Acropolis? Conflicting answers to nearly all of these questions have appeared since the discovery of the temple. Only the first question has received one and the same answer from all. The material and the technical execution of the peripteros, entablature, etc., of the temple show conclusively that this part, at least, was erected in the time of Peisistratos. We may therefore accept so much without further discussion. Of the walls of the cella and opisthodomos nothing remains, but the foundations of this part are made of the hard blue limestone of the Acropolis, while the foundations of the outer part are of reddish-gray limestone from the Peiraieus. The foundations of the cella are also less accurately laid than those of the peripteros. These differences lead Dörpfeld to assume that the naos itself (the building contained within the peristyle) existed before the time of Peisistratos, although he does not deny the possibility that builders of one date may have employed different materials and methods, as convenience or economy dictated. Positive proof is not to be hoped for in the absence of the upper walls of the naos, but probability is in favor of Dörpfeld's assumption, that the naos is older than the peristyle, etc. It is further certain, that this temple was called in the sixth century Β.C. το 'Εκατόμπεδον (see below p. 9). So far, we have the most positive possible evidence--that of the remains of the temple itself and the inscription giving its name. The evidence regarding the subsequent history of the temple is not so simple.

Dörpfeld (Mitth. Ath., XII, p. 25 ff.) arrives at the following conclusions: (1) The temple was restored after the departure of the Persians; (2) it was injured by fire B.C. 406; (3) it was repaired and continued in use; (4) it was seen and described by Pausanias I. 24.3 in a lost passage. Let us take up these points in inverse order. The passage of Pausanias reads in our texts:--Λέλκται δέ μοι καί πρότρον (17.1), ώς Άθηναίοις περισσότερόν τι ή τοις άλλοις ές τα θειά εστι σπουδης· πρώτοι μεν γαρ Άθηνάν έπωνόμασαν Έργάνην, πρωτοι δ' άκώλους Έρμάς ... όμού δέ σφισιν εν τω ναώ Σπουδαίων δαίμων εστίν. Dörpfeld marks a lacuna between Έρμάς and όμού, as do those editors who do not supply a recommendation. Dörpfeld, however, thinks the gap is far greater than has been supposed, including certainly the mention and probably the full description of the temple under discussion. His reasons are in substance about as follows: (1) Pausanias has reached a point in his periegesis where he would naturally mention this temple, because he is standing beside it, and (2) the phrase όμου δέ σφισιν εν τω ναω Σπουδαίων δαίμων eστίν implies that a temple has just been mentioned. These are, at least, the main arguments, those deduced from the passage following the description of the Erechtheion being merely accessory.
```

Quoted from [here](https://www.gutenberg.org/cache/epub/20153/pg20153-images.html)

</details>

### Output

<details>
<summary>Output Text</summary>

```
(English) The history of a temple on the Acropolis presents several unanswered questions, including when it was built and if it continued in use after the Parthenon was erected. Conflicting answers have appeared since its discovery, but it is certain that the peripteros and entablature were erected in the time of Peisistratos. The naos itself (the building contained within the peristyle) may be older than the peristyle. Positive proof is lacking due to the absence of the upper walls of the naos, but probability is in favor of this assumption. The temple was called Βοmbos during the sixth century B.C., and it was restored after the departure of the Persians, injured by fire in 406 B.C., repaired, and continued in use. Pausanias likely mentioned the temple, which was located near where he stood while describing other nearby structures on the Acropolis.
```

</details>
