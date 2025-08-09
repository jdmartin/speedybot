import { EmbedBuilder } from "discord.js";

const theCommonStem = process.env.STRATS_COMMON_STEM || "";
const theCommonAlso = process.env.STRATS_COMMON_ALSO || "";

const sepulchre = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xFFFFFF)
    .setAuthor({
        name: "⛓"
    })
    .setDescription("__Sepulchre of the First Ones__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed..."
    })
    .addFields({
        name: "Bosses",
        value: `[Vigilant Guardian](${theCommonStem}/947960827326115871)\n[Skolex](${theCommonStem}/948029005741850624)\n[Xy'Mox, take 2](${theCommonStem}/955914735956668466)\n[Dausegne](${theCommonStem}/948961279786254447)\n[Pantheon](${theCommonStem}/949042645177622549)\n[Lihuvium](${theCommonStem}/952604140855525527)\n[Halondrus](${theCommonStem}/955979512582135829)\n[Anduin](${theCommonStem}/956592880695271424)\n`,
        inline: true
    })
    .addFields({
        name: "Even More Bosses",
        value: `[Rygelon](${theCommonStem}/966888525184270406)\n[Lords of Dread](${theCommonStem}/969296305472036944)\n[The Jailer](${theCommonStem}/969316069028286474)`,
        inline: true
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`
    })
const sanctum = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xFFFFFF)
    .setAuthor({
        name: "🏹"
    })
    .setDescription("__Sanctum of Domination__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed..."
    })
    .addFields({
        name: "Bosses",
        value: `[The Tarragrue](${theCommonStem}/861108078976172072)\n[Eye of the Jailer](${theCommonStem}/861108185917161473)\n[The Nine](${theCommonStem}/861108293966495747)\n[Ner'zhul](${theCommonStem}/861108398400471060)\n[Soulrender Dormazain](${theCommonStem}/861748064217858109)\n[Painsmith](${theCommonStem}/862858655089819659)\n[Fatescribe](${theCommonStem}/865345466396966932)\n[Guardian](${theCommonStem}/865354245535301662)\n[Kel'Thuzad](${theCommonStem}/878071037298880542)`,
        inline: true
    })
    .addFields({
        name: "Sylvanas",
        value: `[Phase One](${theCommonStem}/878071137840554004)\n[Phase Two](${theCommonStem}/878071205238808587)\n[Phase Three](${theCommonStem}/878071279859687476)`,
        inline: true
    })
    .addFields({
        name: "Notes:",
        value: `[Dormazain](${theCommonStem}/900823247287902309)\n[Sylvanas Swirlys](${theCommonStem}/893341077585670176)\n\nWant Nathria? Use \`!strats nathria\``,
        inline: true
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`
    })
const nathria = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xFFFFFF)
    .setAuthor({
        name: "🧛‍♀️"
    })
    .setDescription("__Castle Nathria__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed..."
    })
    .addFields({
        name: "Bosses",
        value: `[Shriekwing](${theCommonStem}/793739928093065236)\n[Huntsman](${theCommonStem}/793740029323247646)\n[Destroyer](${theCommonStem}/793740126454284328)\n[Darkvein](${theCommonStem}/796565645612285972)\n[Xy'Mox](${theCommonStem}/795513357817479219)`,
        inline: true
    })
    .addFields({
        name: "Even More Bosses",
        value: `[Sun King](${theCommonStem}/796099898201341952)\n[Council](${theCommonStem}/796831060709081160)\n[Sludgefist](${theCommonStem}/797714826297344070)\n[Stone Legion](${theCommonStem}/797999175044038656)`,
        inline: true
    })
    .addFields({
        name: "Denathrius",
        value: `[Phase 1](${theCommonStem}/799400259205464075)\n[Phase 2](${theCommonStem}/799412289530626058)\n[Phase 3](${theCommonStem}/799452523735023646)`,
        inline: true
    })
    .addFields({
        name: "Heroic",
        value: `[Shriekwing](${theCommonStem}/821981070320861184)\n[Huntsman](${theCommonStem}/821981177593331713)\n[Destroyer](${theCommonStem}/821981301858631680)\n[Darkvein](${theCommonStem}/821981414957514753)\n[Xy'Mox](${theCommonStem}/821981523372539954)`
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`
    })

export { nathria, sanctum, sepulchre };
